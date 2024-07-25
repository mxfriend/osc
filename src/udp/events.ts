import { OSCEvent } from '../events';
import type { UdpOSCPeer } from './port';

export namespace UdpOSCEvent {
  export const Message = OSCEvent.Message<UdpOSCPeer>;
  export type Message = OSCEvent.Message<UdpOSCPeer>;
  export const Bundle = OSCEvent.Bundle<UdpOSCPeer>;
  export type Bundle = OSCEvent.Bundle<UdpOSCPeer>;

  export class Error extends OSCEvent {
    constructor(readonly error: any) {
      super();
    }
  }

  export type Any = Error | OSCEvent.Any<UdpOSCPeer>;
}
