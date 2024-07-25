# @mxfriend/osc

This package provides an OSC format 1.1 client and server written in TypeScript.
All OSC 1.1 required types (int, float, string, blob, booleans, nil, impulse
and timetag), as well as all the other non-standard types listed in the OSC 1.0
specification (bigint, double, symbol, char, RGBA color, MIDI message and arrays)
are supported, as are OSC bundles.

The package provides an abstract "OSC Port" implementation, which has no dependencies
and needs to be extended to provide a suitable transport layer. The core of the package
is written to be environment-agnostic - it can be run both in NodeJS and in the browser.
There are several OSC Port implementations you can use in various environments available
under sub-path exports.

## Installation

```shell
npm install --save @mxfriend/osc
```

## Usage

First you need to create an OSC Port. An OSC Port can both send and receive OSC
messages, so there's no separate client and server implementation.

This example uses the built-in UDP OSC Port implementation. The options object,
as well as all of its properties, is optional; default values and option descriptions
are shown in the following example:

```typescript
import { OSCEvent } from '@mxfriend/osc';
import { UdpOSCPort, UdpOSCPeer } from '@mxfriend/osc/udp';

const conn = new UdpOSCPort({
  localAddress: '0.0.0.0',  // the local IP the UDP socket should bind to; the default means all
  localPort: 0,             // the local port the UDP socket should bind to; 0 means random
  remoteAddress: undefined, // the default IP to send OSC messages to
  remotePort: undefined,    // the default port to send OSC messages to
  broadcast: false,         // set to true to enable sending UDP broadcasts
});

// Binds the UDP port & sets up internal event listeners.
await conn.open();
```

### Receiving OSC messages

The library allows you to subscribe to all messages and / or bundles received
by a given port like this:

```typescript
conn.on(OSCEvent.Message, (evt: OSCEvent.Message) => {
  console.log(
    evt.message, // an OSCMessage object
    evt.peer, // transport-specific value representing the remote peer
  );
});

// Subscribe to incoming OSC bundles; if this event isn't handled
// explicitly, the OSC port will iterate over the bundle elements
// recursively and emit a `message` event for each `OSCMessage`
// the bundle contains:
conn.on(OSCEvent.Bundle, (evt: OSCEvent.Bundle) => {
  console.log(
    evt.bundle, // an OSCBundle object
    evt.peer, // transport-specific value representing the remote peer
  );
});
```

As an alternative you can subscribe directly to OSC addresses,
if you know them in advance. The decoder will then only decode
the address part of each received message, and if the address
doesn't match any of the subscribed addresses, the message will
be discarded without decoding the rest of its contents.

> Note that if you do this, bundle events will never be emitted,
> as bundles will only be scanned for subscribed messages, never
> fully decoded. Message events will also only be fired for messages
> which match at least one of the subscribed addresses.

```typescript
conn.subscribe('/some/osc/address', (message: OSCMessage, peer?: UdpOSCPeer) => {
  console.log(message.address); // '/some/osc/address'
});
```

You can take this one step further and only subscribe to messages which
match not only the address part, but the OSC argument types as well.

```typescript
// Send OSC messages:
await conn.send('/foo/bar', [
  { type: 'i', value: 123 },
  { type: 's', value: 'baz' },
]);

// Send OSC bundles:
await conn.sendBundle({
  elements: [
    {
      address: '/foo/bar',
      args: [
        { type: 'i', value: 123 },
        { type: 's', value: 'baz' },
      ],
    }
  ],
  timetag: 12345678901234567890n // bigint
});
```

### Other OSC Port implementations

Apart from `UdpOSCPort` there is also a couple of other implementations
available out of the box:

 - **`WebsocketOSCPort`** for browser environments; exported from `@mxfriend/osc/websocket`.
   Takes the websocket URL as its first and only argument.
 - **`WsOSCPort`** is the Node.JS counterpart of `WebsocketOSCPort`; it is based on the popular
   [`ws`](https://npmjs.com/package/ws) package. Simply pass any accepted websocket connections
   to the `add(client: WebSocket)` method of an instance of this implementation.

### Helpers

There is a number of helper functions for composing strongly typed OSC messages
and extracting strongly typed values from incoming messages. They are collectively
exported as the `osc` object.

```typescript
import { osc } from '@mxfriend/osc';

// Compose OSC arguments, messages and bundles:
osc.compose('s', 'a string argument', 'i', 123, 'f', 3.14); // => OSCArgument[]
osc.compose('i', 'string value'); // TypeScript error, expected number, got string
osc.message('/destination/address', 's', 'a string argument', 's', 'another string argument'); // => OSCMessage
osc.bundle(
  new Date(), // timetag can be Date | string | number | bigint; if omitted, Date.now() will be used
  osc.message('/a/b/c', 'i', 123),
  osc.message('/d/e', 'B', true),
);

// Compose individual OSC arguments:
osc.int(123); // OSCInt
osc.optional.string('maybe this is undefined?'); // OSCString | undefined
osc.nullable.float(3.14); // OSCFloat | OSCNull

// Extract strongly typed OSC arguments:
const [a, b, c] = osc.extract(args, 's', 'i', 'B');

if (a !== undefined) {
  // it's enough to check the first argument to know that
  // all arguments were extracted successfully, that is,
  // here we know that `a` is `string`, `b` is `number` and `c`
  // is `boolean`
} else {
  // at least one argument was missing or an unexpected type,
  // so all returned values are undefined
}

const [d, e, f] = osc.extract(args, 's', 'B?', '...i');

if (d !== undefined) {
  // `d` is `string`, `e` is `boolean | undefined` and
  // `f` is `number[]`
}
```

### ... wait, that's it?

Yep. I'm too impatient to write an extensive documentation at this point.
I'll get to it eventually, maybe. In the meantime just look through the code,
there's not a lot of it; in particular look at `src/types.ts` and `src/values.ts`
where the OSC argument types are defined, and `src/helpers.ts` for the helpers.


## Development

 - To run tests, use `make tests`.
 - To build the code, use `make`, or `make rebuild` to build from scratch.
 - To release a new version of the package, run `npm version <major|minor|patch>`
   and push to the repository, Github Actions will take care of the rest.
