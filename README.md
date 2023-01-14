# @mxfriend/osc

This package provides an OSC format 1.1 client and server written in TypeScript.
All OSC 1.1 required types (int, float, string, blob, booleans, nil, impulse
and timetag), as well as all the other non-standard types listed in the OSC 1.0
specification (bigint, double, symbol, char, RGBA color, MIDI message and arrays)
are supported, as are OSC bundles.

The package provides an abstract "OSC Port" implementation, which has no dependencies
and needs to be extended to provide a suitable transport layer. In NodeJS and compatible
environments there is a UDP OSC Port implementation available under a sub-path export.

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
import { OSCBundle, OSCMessage } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';

const osc = new UdpOSCPort({
  localAddress: '0.0.0.0',  // the local IP the UDP socket should bind to; the default means all
  localPort: 0,             // the local port the UDP socket should bind to; 0 means random
  remoteAddress: undefined, // the default IP to send OSC messages to
  remotePort: undefined,    // the default port to send OSC messages to
  broadcast: false,         // set to true to enable sending UDP broadcasts
});

// binds the UDP port & sets up internal event listeners
await osc.open();

// subscribe to all incoming OSC messages
osc.on('message', (message: OSCMessage) => {
  console.log(message.address, message.args);
});

// subscribe to incoming OSC bundles; if this event isn't handled
// explicitly, the OSC port will iterate over the bundle elements
// recursively and emit a `message` event for each `OSCMessage`
// the bundle contains
osc.on('bundle', (bundle: OSCBundle) => {
  console.log(bundle.timetag, bundle.elements);
});

// as an alternative you can subscribe directly to addresses
// or address patterns; this may be more performant if you get
// lots of messages, but only care about some of them, and you
// know the addresses in advance.
//
// note that if you do this, bundle events will never be emitted,
// as bundles will only be scanned for subscribed messages, never
// fully decoded.
osc.subscribe('/some/address/pattern/*', (message: OSCMessage) => {
  console.log(message.address.startsWith('/some/address/pattern/') === true);
});

// send OSC messages
await osc.sendMessage({
  address: '/foo/bar',
  args: [
    { type: 'i', value: 123 },
    { type: 's', value: 'baz' },
  ],
});

// send OSC bundles
await osc.sendBundle({
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

### ... wait, that's it?

Yep. I'm too impatient to write an extensive documentation at this point.
I'll get to it eventually, maybe. In the meantime just look through the code,
there's not a lot of it; in particular look at `src/types.ts` and `src/values.ts`
where the OSC argument types are defined.


## Development

 - To run tests, use `make tests`.
 - To build the code, use `make`, or `make rebuild` to build from scratch.
 - To release a new version of the package, run `npm version <major|minor|patch>`
   and push to the repository, Github Actions will take care of the rest.
