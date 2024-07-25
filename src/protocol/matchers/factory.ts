import { AnyTypeMatcher, EmptyTypeMatcher, TypeSpecMatcher } from './matchers';
import type { TypeMatcher } from './types';

type MatcherInfo = {
  matcher: TypeMatcher;
  keys: Set<unknown>;
};

export class TypeMatcherFactory {
  readonly #matchers: Map<string, MatcherInfo> = new Map();

  get(typeSpec: string, key?: unknown): TypeMatcher {
    const existing = this.#matchers.get(typeSpec);

    if (existing) {
      if (key !== undefined) {
        existing.keys.add(key);
      }

      return existing.matcher;
    }

    const matcher = this.#createMatcher(typeSpec);

    if (key !== undefined) {
      const keys = new Set([key]);
      this.#matchers.set(typeSpec, { matcher, keys });
    }

    return matcher;
  }

  release(typeSpec: string, key: unknown): void {
    const info = this.#matchers.get(typeSpec);

    if (info) {
      info.keys.delete(key);

      if (!info.keys.size) {
        this.#matchers.delete(typeSpec);
      }
    }
  }

  #createMatcher(typeSpec: string): TypeMatcher {
    switch (typeSpec) {
      case '':
        return new EmptyTypeMatcher();
      case '.*':
        return new AnyTypeMatcher();
      default:
        return new TypeSpecMatcher(typeSpec);
    }
  }
}
