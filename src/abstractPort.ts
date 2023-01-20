import { PacketInterface } from './buffer';
import { OSCDecoder } from './decoder';
import { OSCEncoder } from './encoder';
import { EventEmitter, EventMapExtension, MergeEventMap } from './eventEmitter';
import { OSCArgument, OSCBundle, OSCBundleElement, OSCMessage, isBundle } from './types';

export type SubscriptionHandler<TPeer = unknown> = (message: OSCMessage, peer?: TPeer) => void;

export type CommonEvents<TPeer = unknown> = {
  bundle: [bundle: OSCBundle, peer?: TPeer];
  message: [message: OSCMessage, peer?: TPeer];
};

export abstract class AbstractOSCPort<
  TPeer = unknown,
  TEvents extends EventMapExtension<CommonEvents<TPeer>> = {},
> extends EventEmitter<MergeEventMap<CommonEvents<TPeer>, TEvents>> {
  private readonly encoder: OSCEncoder = new OSCEncoder();
  private readonly decoder: OSCDecoder = new OSCDecoder();
  private readonly subscribers: Map<string, Set<SubscriptionHandler<TPeer>>> = new Map();

  protected abstract sendPacket(packet: PacketInterface, to?: TPeer): Promise<void> | void;

  protected receive(packet: PacketInterface, from?: TPeer): void {
    for (const element of this.decoder.decodePacket(packet)) {
      this.emitOSCElement(element, from);
    }
  }

  public async send(address: string, args?: OSCArgument[], to?: TPeer): Promise<void> {
    await this.sendPacket(this.encoder.encodeMessage(address, args), to);
  }

  public async sendBundle(elements: OSCBundleElement[], timetag?: bigint, to?: TPeer): Promise<void> {
    await this.sendPacket(this.encoder.encodeBundle(elements, timetag), to);
  }

  public subscribe(address: string, handler: SubscriptionHandler<TPeer>): void {
    if (!this.subscribers.has(address)) {
      this.subscribers.set(address, new Set());
      this.decoder.addKnownAddress(address);
    }

    this.subscribers.get(address)!.add(handler);
  }

  public unsubscribe(address?: string, handler?: SubscriptionHandler<TPeer>): void {
    if (!address) {
      this.subscribers.clear();
      this.decoder.removeAllKnownAddresses();
    } else if (!handler) {
      this.subscribers.delete(address);
      this.decoder.removeKnownAddress(address);
    } else {
      const handlers = this.subscribers.get(address);

      if (handlers) {
        handlers.delete(handler);
      }

      if (!handlers || handlers.size < 1) {
        this.subscribers.delete(address);
        this.decoder.removeKnownAddress(address);
      }
    }
  }

  private emitOSCElement(element: OSCBundleElement, from?: TPeer): void {
    if (isBundle(element)) {
      if (!this.emit('bundle', element, from)) {
        for (const child of element.elements) {
          this.emitOSCElement(child, from);
        }
      }
    } else {
      const subscribers = this.subscribers.get(element.address);

      if (subscribers) {
        for (const handler of subscribers) {
          handler(element, from);
        }
      }

      this.emit('message', element, from);
    }
  }
}
