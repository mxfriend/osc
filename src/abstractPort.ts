import { OSCArgument, OSCBundleElement, isBundle, OSCMessage } from './types';
import { encodeMessage, encodeBundle, decodePacket } from './utils';

export type EventHandler = (...args: any) => void;

export type EventMap = {
  [event: string]: EventHandler;
};

export type CommonEvents<TSrcPeer = unknown> = {
  message: (event: 'message', message: OSCMessage, peer?: TSrcPeer) => void;
  bundle: (event: 'bundle', message: OSCMessage, peer?: TSrcPeer) => void;
}

export abstract class AbstractOSCPort<TDstPeer = unknown, TSrcPeer = TDstPeer, TEvents extends EventMap = CommonEvents<TSrcPeer>> {
  private readonly events: Map<string, Set<EventHandler>> = new Map();

  protected abstract sendPacket(packet: Buffer, to?: TDstPeer): Promise<void> | void;

  protected receive(packet: Buffer, from?: TSrcPeer): void {
    this.emitEvents(decodePacket(packet), from);
  }

  public async send(address: string, args?: OSCArgument[], to?: TDstPeer): Promise<void> {
    await this.sendPacket(encodeMessage(address, args), to);
  }

  public async sendBundle(elements: OSCBundleElement[], timetag?: bigint, to?: TDstPeer): Promise<void> {
    await this.sendPacket(encodeBundle(elements, timetag), to);
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

  private emitEvents(element: OSCBundleElement, from?: TSrcPeer): void {
    if (isBundle(element)) {
      if (!this.emit('bundle', element, from)) {
        for (const child of element.elements) {
          this.emitEvents(child, from);
        }
      }
    } else {
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
