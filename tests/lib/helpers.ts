/**
 * These are just small helpers to allow blobs containing the expected data
 * in the tests to be written as close to human-readable as possible.
 */
import { AssertionError } from 'assert';
import { isTypedArray } from 'util/types';

export function buf(...items: (number | string | bigint | Buffer)[]): Buffer {
  return Buffer.concat(
    items.map((v) => {
      switch (typeof v) {
        case 'string':
          return Buffer.from(v);
        case 'number':
          return Buffer.of(v);
        case 'bigint':
          return bigintToBuffer(v);
        default:
          return v;
      }
    }),
  );
}

export function nil(n: number): Buffer {
  return Buffer.alloc(n);
}

export function int32(v: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeInt32BE(v);
  return buf;
}

export function uint32(v: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUint32BE(v);
  return buf;
}

export function double(v: number): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeDoubleBE(v);
  return buf;
}

function bigintToBuffer(v: bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(v);
  return buf;
}

function isDeeplyEqual(actual: unknown, expected: unknown): boolean {
  if (actual === expected) {
    return true;
  }

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) {
      return false;
    }

    for (let i = 0; i < actual.length; ++i) {
      if (!isDeeplyEqual(actual[i], expected[i])) {
        return false;
      }
    }

    return true;
  } else if (isTypedArray(expected)) {
    if (
      !isTypedArray(actual) ||
      actual.length !== expected.length ||
      !(actual instanceof expected.constructor)
    ) {
      return false;
    }

    for (let i = 0; i < actual.length; ++i) {
      if (actual[i] !== expected[i]) {
        return false;
      }
    }

    return true;
  } else if (typeof expected === 'object' && expected !== null) {
    if (typeof actual !== 'object' || actual === null) {
      return false;
    }

    const visited: Set<string> = new Set();

    for (const p of Object.getOwnPropertyNames(actual)) {
      if (!Object.hasOwn(expected, p) || !isDeeplyEqual((actual as any)[p], (expected as any)[p])) {
        return false;
      }

      visited.add(p);
    }

    for (const p of Object.getOwnPropertyNames(expected)) {
      if (visited.has(p)) {
        continue;
      }

      if (!Object.hasOwn(actual, p) || !isDeeplyEqual((actual as any)[p], (expected as any)[p])) {
        return false;
      }
    }

    return true;
  } else if (typeof expected === 'number') {
    if (typeof actual !== 'number') {
      return false;
    }

    return Math.abs(expected - actual) < 0.0000001;
  } else {
    return false;
  }
}

export function assertDeeplyEqual(actual: unknown, expected: unknown): void {
  if (!isDeeplyEqual(actual, expected)) {
    throw new AssertionError({
      message: 'Expected values to be deeply equal',
      expected,
      actual,
      operator: '===',
    });
  }
}
