export class Cursor {
  index: number = 0;

  inc(bytes: number): number {
    const index = this.index;
    this.index += bytes;
    return index;
  }
}

export interface BufferInterface extends Uint8Array {
  subarray(start?: number, end?: number): BufferInterface;
  equals(other: BufferInterface): boolean;

  readUint8(offset: number): number;
  readUint32BE(offset: number): number;
  readInt32BE(offset: number): number;
  readInt32LE(offset: number): number;
  readFloatBE(offset: number): number;
  readDoubleBE(offset: number): number;
  readBigInt64BE(offset: number): bigint;

  toString(encoding?: 'ascii'): string;

  writeUint8(value: number, offset?: number): number;
  writeUint32BE(value: number, offset?: number): number;
  writeInt32BE(value: number, offset?: number): number;
  writeInt32LE(value: number, offset?: number): number;
  writeFloatBE(value: number, offset?: number): number;
  writeDoubleBE(value: number, offset?: number): number;
  writeBigInt64BE(value: bigint, offset?: number): number;
}

const textDecoder = new TextDecoder('ascii');

export class BufferPolyfill extends Uint8Array implements BufferInterface {
  private readonly view: DataView;

  static from(value: any): BufferPolyfill {
    if (typeof value !== 'string') {
      throw new TypeError('This method only supports string input');
    }

    const buffer = new BufferPolyfill(new ArrayBuffer(value.length));

    for (let i = 0; i < value.length; ++i) {
      buffer.writeUint8(value.charCodeAt(i), i);
    }

    return buffer;
  }

  static of(...values: number[]): BufferPolyfill {
    return new BufferPolyfill(values);
  }

  static allocUnsafe(size: number): BufferPolyfill {
    return new BufferPolyfill(new ArrayBuffer(size));
  }

  static concat(buffers: BufferInterface[]): BufferInterface {
    const size = buffers.reduce((s, b) => s + b.byteLength, 0);
    const tmp = new Uint8Array(size);
    let offset = 0;

    for (const src of buffers) {
      tmp.set(src, offset);
      offset += src.byteLength;
    }

    return new BufferPolyfill(tmp.buffer);
  }

  constructor(elements: Iterable<number>);
  constructor(buffer: ArrayBuffer, byteOffset?: number, length?: number);
  constructor(a0: any, a1?: any, a2?: any) {
    super(a0, a1, a2);
    this.view = new DataView(this.buffer);
  }

  subarray(start?: number, end?: number): BufferPolyfill {
    return new BufferPolyfill(this.buffer, start, start !== undefined && end !== undefined ? end - start : undefined);
  }

  equals(other: BufferInterface): boolean {
    return this.every((v, i) => v === other[i]);
  }

  readUint8(offset: number): number {
    return this.view.getUint8(offset);
  }
  readUint32BE(offset: number): number {
    return this.view.getUint32(offset);
  }
  readInt32BE(offset: number): number {
    return this.view.getInt32(offset);
  }
  readInt32LE(offset: number): number {
    return this.view.getInt32(offset, true);
  }
  readFloatBE(offset: number): number {
    return this.view.getFloat32(offset);
  }
  readDoubleBE(offset: number): number {
    return this.view.getFloat64(offset);
  }
  readBigInt64BE(offset: number): bigint {
    return this.view.getBigInt64(offset);
  }
  toString(encoding?: 'ascii'): string {
    return textDecoder.decode(this.buffer);
  }

  writeUint8(value: number, offset = 0): number {
    this.view.setUint8(offset, value);
    return offset + 1;
  }
  writeUint32BE(value: number, offset: number = 0): number {
    this.view.setUint32(offset, value);
    return offset + 4;
  }
  writeInt32BE(value: number, offset: number = 0): number {
    this.view.setInt32(offset, value);
    return offset + 4;
  }
  writeInt32LE(value: number, offset: number = 0): number {
    this.view.setInt32(offset, value, true);
    return offset + 4;
  }
  writeFloatBE(value: number, offset: number = 0): number {
    this.view.setFloat32(offset, value);
    return offset + 4;
  }
  writeDoubleBE(value: number, offset: number = 0): number {
    this.view.setFloat64(offset, value);
    return offset + 8;
  }
  writeBigInt64BE(value: bigint, offset: number = 0): number {
    this.view.setBigInt64(offset, value);
    return offset + 8;
  }
}

export const $Buffer = typeof Buffer === 'undefined' ? BufferPolyfill : Buffer;
