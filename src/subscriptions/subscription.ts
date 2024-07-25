import type { TypeMatcher, TypeMatcherFactory } from '../protocol';
import type { OSCMessage, OSCMessageHandler } from '../types';

export class Subscription<Peer = unknown> {
  readonly #typeMatchers: TypeMatcherFactory;
  readonly #handlers: Map<OSCMessageHandler<Peer>, TypeMatcher> = new Map();

  constructor(typeMatchers: TypeMatcherFactory) {
    this.#typeMatchers = typeMatchers;
  }

  add(handler: OSCMessageHandler<Peer>, typeSpec: string = '.*'): void {
    const matcher = this.#typeMatchers.get(typeSpec, handler);
    this.#handlers.set(handler, matcher);
  }

  remove(handler?: OSCMessageHandler<Peer>, typeSpec: string = '.*'): void {
    if (handler) {
      this.#handlers.delete(handler);
      this.#typeMatchers.release(typeSpec, handler);
      return;
    }

    for (const h of this.#handlers.keys()) {
      this.#typeMatchers.release(typeSpec, h);
    }

    this.#handlers.clear();
  }

  isEmpty(): boolean {
    return !this.#handlers.size;
  }

  handle(message: OSCMessage, peer?: Peer): void {
    const matches: WeakMap<TypeMatcher, boolean> = new WeakMap();

    for (const [handler, matcher] of this.#handlers) {
      const previous = matches.get(matcher);

      if (previous !== undefined) {
        previous && handler(message, peer);
      } else if (matcher.matches(message.types)) {
        matches.set(matcher, true);
        handler(message, peer);
      } else {
        matches.set(matcher, false);
      }
    }
  }
}
