import type { BufferInterface } from '../buffer';
import { $Buffer } from '../buffer';
import type { OSCColorValue, OSCMIDIValue } from '../types';
import type { TypeResolver } from './types';

export class IntResolver implements TypeResolver<number> {
  getTypeName(): string {
    return 'int';
  }

  isValidValue(value: unknown): value is number {
    return Number.isInteger(value);
  }

  getTypeTag(): string {
    return 'i';
  }
}

export class FloatResolver implements TypeResolver<number> {
  getTypeName(): string {
    return 'float';
  }

  isValidValue(value: unknown): value is number {
    return typeof value === 'number';
  }

  getTypeTag(): string {
    return 'f';
  }
}

export class StringResolver implements TypeResolver<string> {
  readonly #typeTag: string;
  readonly #typeName: string;

  constructor(typeTag: 's' | 'S', typeName: 'string' | 'symbol') {
    this.#typeTag = typeTag;
    this.#typeName = typeName;
  }

  getTypeName(): string {
    return this.#typeName;
  }

  isValidValue(value: unknown): value is string {
    return typeof value === 'string';
  }

  getTypeTag(): string {
    return this.#typeTag;
  }
}

export class BlobResolver implements TypeResolver<BufferInterface> {
  getTypeName(): string {
    return 'blob';
  }

  isValidValue(value: unknown): value is BufferInterface {
    return $Buffer.isBuffer(value);
  }

  getTypeTag(): string {
    return 'b';
  }
}

export class BigIntResolver implements TypeResolver<bigint> {
  readonly #typeTag: string;
  readonly #typeName: string;

  constructor(typeTag: 'h' | 't', typeName: 'bigint' | 'timetag') {
    this.#typeTag = typeTag;
    this.#typeName = typeName;
  }

  getTypeName(): string {
    return this.#typeName;
  }

  isValidValue(value: unknown): value is bigint {
    return typeof value === 'bigint';
  }

  getTypeTag(): string {
    return this.#typeTag;
  }
}

export class DoubleResolver implements TypeResolver<number> {
  getTypeName(): string {
    return 'double';
  }

  isValidValue(value: unknown): value is number {
    return typeof value === 'number';
  }

  getTypeTag(): string {
    return 'd';
  }
}

export class CharResolver implements TypeResolver<string> {
  getTypeName(): string {
    return 'char';
  }

  isValidValue(value: unknown): value is string {
    return typeof value === 'string' && value.length === 1 && value.charCodeAt(0) <= 127;
  }

  getTypeTag(): string {
    return 'c';
  }
}

export class ValueResolver<V extends OSCMIDIValue | OSCColorValue> implements TypeResolver<V> {
  readonly #ctor: abstract new (...args: any) => V;
  readonly #typeTag: string;

  constructor(ctor: abstract new (...args: any) => V, typeTag: string) {
    this.#ctor = ctor;
    this.#typeTag = typeTag;
  }

  getTypeName(): string {
    return this.#ctor.name;
  }

  isValidValue(value: unknown): value is V {
    return value instanceof this.#ctor;
  }

  getTypeTag(): string {
    return this.#typeTag;
  }
}

export class BooleanResolver implements TypeResolver<boolean> {
  getTypeName(): string {
    return 'boolean';
  }

  isValidValue(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  getTypeTag(value: boolean): string {
    return value ? 'T' : 'F';
  }
}

export class NullResolver implements TypeResolver<null> {
  getTypeName(): string {
    return 'null';
  }

  isValidValue(value: unknown): value is null {
    return value === null;
  }

  getTypeTag(): string {
    return 'N';
  }
}

export class InfinityResolver implements TypeResolver<number> {
  getTypeName(): string {
    return 'infinity';
  }

  isValidValue(value: unknown): value is number {
    return value === Infinity;
  }

  getTypeTag(): string {
    return 'I';
  }
}
