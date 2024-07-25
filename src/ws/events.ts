import type { WebSocket } from 'ws';

import { OSCEvent } from '../events';

export namespace WsOSCEvent {
  export const Message = OSCEvent.Message<WebSocket>;
  export type Message = OSCEvent.Message<WebSocket>;
  export const Bundle = OSCEvent.Bundle<WebSocket>;
  export type Bundle = OSCEvent.Bundle<WebSocket>;

  export class Close extends OSCEvent {
    constructor(readonly client: WebSocket) {
      super();
    }
  }

  export type Any = Close | OSCEvent.Any<WebSocket>;
}
