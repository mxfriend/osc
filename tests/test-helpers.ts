/**
 * These are just small helpers to allow blobs containing the expected data
 * in the tests to be written as close to human-readable as possible.
 */

export function buf(...items: (number | string | bigint | Buffer)[]): Buffer {
  return Buffer.concat(items.map((v) => {
    switch (typeof v) {
      case 'string': return Buffer.from(v);
      case 'number': return Buffer.of(v);
      case 'bigint': return bigintToBuffer(v);
      default: return v;
    }
  }));
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



/**
 * The following is needed in order to easily test deep equality
 * of decoded OSC arguments taking into account float rounding errors
 */

interface CustomMatchers<R = unknown> {
  toEqualCustom(value: unknown): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

expect.extend({
  toEqualCustom(received, expected) {
    const matcherName = 'toEqual';
    const options = {
      comment: 'deep equality',
      isNot: this.isNot,
      promise: this.promise,
    };

    const pass = this.equals(received, expected, [
      compareBuffers,
      compareFloats,
      this.utils.iterableEquality,
    ]);

    const stringify = (value: any): string => {
      return typeof value === 'bigint'
        ? value.toString().replace(/$/, 'n')
        : this.utils.stringify(value);
    };

    const message = pass
      ? () =>
        this.utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        `Expected: not ${this.utils.printExpected(expected)}\n` +
        (stringify(expected) !== stringify(received)
          ? `Received:     ${this.utils.printReceived(received)}`
          : '')
      : () =>
        this.utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        this.utils.printDiffOrStringify(
          expected,
          received,
          'Expected',
          'Received',
          this.expand !== false,
        );

    return {actual: received, expected, message, name: matcherName, pass};
  },
});

function compareBuffers(a: any, b: any): boolean | undefined {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    return undefined;
  }

  return a.equals(b);
}

function compareFloats(a: any, b: any): boolean | undefined {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return undefined;
  }

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return a === b;
  }

  return Math.abs(a - b) < Math.pow(10, -9) / 2;
}
