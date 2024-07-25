import { OSCEvent } from '../events';

export namespace WebsocketOSCEvent {
  export const Message = OSCEvent.Message<WebSocket>;
  export type Message = OSCEvent.Message<WebSocket>;
  export const Bundle = OSCEvent.Bundle<WebSocket>;
  export type Bundle = OSCEvent.Bundle<WebSocket>;

  export class Error extends OSCEvent {
    constructor(readonly event: Event) {
      super();
    }
  }

  export type Any = Error | OSCEvent.Any<WebSocket>;
}
