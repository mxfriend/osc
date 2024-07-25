import type { TypeMatcherFactory } from '../protocol';
import { defaultTypeMatchers } from '../protocol';
import type { OSCMessageHandler } from '../types';
import { Subscription } from './subscription';

export class SubscriptionManager<Peer = unknown> {
  readonly #subscriptions: Map<string, Subscription<Peer>> = new Map();
  readonly #typeMatchers: TypeMatcherFactory;

  constructor(typeMatchers: TypeMatcherFactory = defaultTypeMatchers) {
    this.#typeMatchers = typeMatchers;
  }

  add(address: string, handler: OSCMessageHandler<Peer>, types?: string): void {
    let subscription = this.#subscriptions.get(address);

    if (!subscription) {
      subscription = new Subscription(this.#typeMatchers);
      this.#subscriptions.set(address, subscription);
    }

    subscription.add(handler, types);
  }

  remove(address: string, handler?: OSCMessageHandler<Peer>, types?: string): void {
    const subscription = this.#subscriptions.get(address);

    if (subscription) {
      subscription.remove(handler, types);

      if (subscription.isEmpty()) {
        this.#subscriptions.delete(address);
      }
    }
  }

  clear(): void {
    for (const subscription of this.#subscriptions.values()) {
      subscription.remove();
    }

    this.#subscriptions.clear();
  }

  isEmpty(): boolean {
    return !this.#subscriptions.size;
  }

  get(address: string): Subscription<Peer> | undefined {
    return this.#subscriptions.get(address);
  }
}
