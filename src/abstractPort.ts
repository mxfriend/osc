import { type Event, EventEmitter } from '@mxfriend/events';

import type { BufferInterface } from './buffer';
import { OSCEvent } from './events';
import { OSCDecoder, OSCEncoder } from './protocol';
import type { Subscription } from './subscriptions';
import { SubscriptionManager } from './subscriptions';
import type {
  OSCBundleElement,
  OSCMessage,
  OSCMessageHandler,
  OSCTypeTag,
  OSCValues,
  TypedOSCMessageHandler,
} from './types';
import { isBundle } from './types';
import { normaliseTypeTag } from './typeTag';

export abstract class AbstractOSCPort<
  TPeer = unknown,
  TEvents extends Event = never,
> extends EventEmitter<OSCEvent.Any<TPeer> | TEvents> {
  readonly #subscriptions: SubscriptionManager<TPeer> = new SubscriptionManager();
  readonly #encoder: OSCEncoder = new OSCEncoder();
  readonly #decoder: OSCDecoder<TPeer> = new OSCDecoder(this.#subscriptions);

  public abstract isPeer(value?: unknown): value is TPeer;

  protected abstract sendPacket(packet: BufferInterface, to?: TPeer): Promise<void> | void;

  protected receive(packet: BufferInterface, from?: TPeer): void {
    for (const [element, subscription] of this.#decoder.decodePacket(packet)) {
      this.emitOSCElement(element, from, subscription);
    }
  }

  public async send(address: string, to?: TPeer): Promise<void>;
  public async send(message: OSCMessage, to?: TPeer): Promise<void>;
  public async send<S extends string>(
    address: string,
    types: S extends OSCTypeTag<S> ? S : string,
    values: S extends OSCTypeTag<S> ? OSCValues<S> : unknown[],
    to?: TPeer,
  ): Promise<void>;
  public async send(a1: any, a2?: any, a3?: any, a4?: any): Promise<void> {
    if (a3) {
      const types = normaliseTypeTag(a2, a3);
      await this.sendPacket(this.#encoder.encodeMessage(a1, types, a3), a4);
    } else if (typeof a1 === 'string') {
      await this.sendPacket(this.#encoder.encodeMessage(a1), a2);
    } else {
      await this.sendPacket(this.#encoder.encodeMessage(a1.address, a1.types, a1.values), a2);
    }
  }

  public async sendBundle(
    elements: OSCBundleElement[],
    timetag?: bigint,
    to?: TPeer,
  ): Promise<void> {
    await this.sendPacket(this.#encoder.encodeBundle(elements, timetag), to);
  }

  public subscribe(address: string, handler: OSCMessageHandler<TPeer>): void;
  public subscribe<S extends string>(
    address: string,
    types: S extends OSCTypeTag<S> ? S : string,
    handler: S extends OSCTypeTag<S> ? TypedOSCMessageHandler<S, TPeer> : OSCMessageHandler<TPeer>,
  ): void;
  public subscribe(address: string, handlerOrTypes: any, maybeHandler?: any): void {
    const [handler, types] = maybeHandler
      ? [maybeHandler, handlerOrTypes]
      : [handlerOrTypes, undefined];
    this.#subscriptions.add(address, handler, types);
  }

  public unsubscribe(address?: string, handler?: OSCMessageHandler<TPeer>): void;
  public unsubscribe<S extends string>(
    address: string,
    types: S extends OSCTypeTag<S> ? S : string,
    handler: S extends OSCTypeTag<S> ? TypedOSCMessageHandler<S, TPeer> : OSCMessageHandler<S>,
  ): void;
  public unsubscribe(address?: string, handlerOrTypes?: any, maybeHandler?: any): void {
    if (!address) {
      this.#subscriptions.clear();
    } else {
      const [handler, types] = maybeHandler
        ? [maybeHandler, handlerOrTypes]
        : [handlerOrTypes, undefined];
      this.#subscriptions.remove(address, handler, types);
    }
  }

  private emitOSCElement(
    element: OSCBundleElement,
    from?: TPeer,
    subscription?: Subscription<TPeer>,
  ): void {
    if (isBundle(element)) {
      if (!this.emit(new OSCEvent.Bundle(element, from)).isHandled()) {
        for (const child of element.elements) {
          this.emitOSCElement(child, from);
        }
      }
    } else {
      if (subscription) {
        subscription.handle(element, from);
      }

      this.emit(new OSCEvent.Message(element, from));
    }
  }
}
