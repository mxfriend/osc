import type { BufferInterface } from '../../src';
import { AbstractOSCPort, OSCEvent } from '../../src';

export class TestPeer {}

export namespace TestEvent {
  export const Message = OSCEvent.Message<TestPeer>;
  export type Message = OSCEvent.Message<TestPeer>;
  export const Bundle = OSCEvent.Bundle<TestPeer>;
  export type Bundle = OSCEvent.Bundle<TestPeer>;
}

export class TestOSCPort extends AbstractOSCPort<TestPeer> {
  readonly sentPackets: [packet: BufferInterface, to?: TestPeer][] = [];

  isPeer(value: unknown | undefined): value is TestPeer {
    return value instanceof TestPeer;
  }

  public injectReceivedPacket(packet: BufferInterface, peer?: TestPeer): void {
    this.receive(packet, peer);
  }

  protected async sendPacket(packet: BufferInterface, to?: TestPeer): Promise<void> {
    this.sentPackets.push([packet, to]);
  }
}
