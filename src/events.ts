import { Event } from '@mxfriend/events';

import type { OSCBundle, OSCMessage } from './types';

export abstract class OSCEvent extends Event {}

export namespace OSCEvent {
  export class Message<Peer = unknown> extends OSCEvent {
    constructor(
      readonly message: OSCMessage,
      readonly peer?: Peer,
    ) {
      super();
    }
  }

  export class Bundle<Peer = unknown> extends OSCEvent {
    constructor(
      readonly bundle: OSCBundle,
      readonly peer?: Peer,
    ) {
      super();
    }
  }

  export type Any<Peer = unknown> = Message<Peer> | Bundle<Peer>;
}
