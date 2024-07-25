import type { TypeMatcher } from './types';
import { createTypeSpecPattern } from './utils';

export class AnyTypeMatcher implements TypeMatcher {
  matches(): boolean {
    return true;
  }
}

export class EmptyTypeMatcher implements TypeMatcher {
  matches(types: string): boolean {
    return types === '';
  }
}

export class TypeSpecMatcher implements TypeMatcher {
  readonly #pattern: RegExp;

  constructor(typeSpec: string) {
    this.#pattern = createTypeSpecPattern(typeSpec);
  }

  matches(types: string): boolean {
    return this.#pattern.test(types);
  }
}
