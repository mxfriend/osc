import { OSCDecoder } from './decoder';
import { OSCEncoder } from './encoder';
import { OSCArgument, OSCBundleElement, OSCMessage, isBundle } from './types';

export type EventHandler = (...args: any) => void;
export type SubscriptionHandler<TPeer = unknown> = (message: OSCMessage, peer?: TPeer) => void;

export type EventMap = {
  [event: string]: EventHandler;
};

export type CommonEvents<TPeer = unknown> = {
  message: (event: 'message', message: OSCMessage, peer?: TPeer) => void;
  bundle: (event: 'bundle', message: OSCMessage, peer?: TPeer) => void;
}

export abstract class AbstractOSCPort<TPeer = unknown, TEvents extends EventMap = CommonEvents<TPeer>> {
  private readonly encoder: OSCEncoder = new OSCEncoder();
  private readonly decoder: OSCDecoder = new OSCDecoder();
  private readonly events: Map<string, Set<EventHandler>> = new Map();
  private readonly subscribers: Map<string, Set<SubscriptionHandler<TPeer>>> = new Map();

  protected abstract sendPacket(packet: Buffer, to?: TPeer): Promise<void> | void;

  protected receive(packet: Buffer, from?: TPeer): void {
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

  public on<Event extends keyof TEvents>(event: Event, handler: TEvents[Event]): void;
  public on(event: string, handler: EventHandler): void;
  public on(event: string, handler: EventHandler): void {
    this.events.has(event) || this.events.set(event, new Set());
    this.events.get(event)!.add(handler);
  }

  public once<Event extends keyof TEvents>(event: Event, handler: TEvents[Event]): void;
  public once(event: string, handler: EventHandler): void;
  public once(event: string, handler: EventHandler): void {
    const wrapper: EventHandler = (...args) => {
      this.off(event, wrapper);
      handler(...args);
    };

    this.on(event, wrapper);
  }

  public off<Event extends keyof TEvents>(event?: Event, handler?: TEvents[Event]): void;
  public off(event?: string, handler?: EventHandler): void;
  public off(event?: string, handler?: EventHandler): void {
    if (!event) {
      this.events.clear();
    } else if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler);
    }
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

  protected emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);

    if (!listeners) {
      return false;
    }

    for (const listener of listeners) {
      listener(event, ...args);
    }

    return true;
  }
}
