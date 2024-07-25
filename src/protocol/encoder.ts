import type { BufferInterface } from '../buffer';
import { $Buffer } from '../buffer';
import type { OSCBundleElement, OSCColorValue, OSCMIDIValue } from '../types';
import { isMessage } from '../types';
import { BUNDLE_TAG } from './utils';

export class OSCEncoder {
  constructor() {
    this.encodeBundleElement = this.encodeBundleElement.bind(this);
  }

  public encodeMessage(address: string, types?: string, values?: any[]): BufferInterface {
    if (!types || !values || !values.length) {
      return $Buffer.concat([this.#writeString(address), this.#writeString(',')]);
    }

    return $Buffer.concat([this.#writeString(address), ...this.#writeArgs(types, values)]);
  }

  public encodeBundle(elements: OSCBundleElement[], timetag?: bigint): BufferInterface {
    return $Buffer.concat([
      this.#writeString(BUNDLE_TAG),
      this.#writeBigInt(timetag ?? 1n),
      ...elements.map(this.encodeBundleElement),
    ]);
  }

  private encodeBundleElement(element: OSCBundleElement): BufferInterface {
    const data = isMessage(element)
      ? this.encodeMessage(element.address, element.types, element.values)
      : this.encodeBundle(element.elements, element.timetag);
    return this.#writeBlob(data);
  }

  *#writeArgs(types: string, values: any[]): Iterable<BufferInterface> {
    const typeTag: string[] = [];
    const data: BufferInterface[] = [];
    const stack: [any[], number][] = [];
    let cursor: any[] = values;
    let c = 0;

    for (const t of types) {
      switch (t) {
        case 'i':
          data.push(this.#writeInt(cursor[c++]));
          typeTag.push(t);
          break;
        case 'f':
          data.push(this.#writeFloat(cursor[c++]));
          typeTag.push(t);
          break;
        case 's':
        case 'S':
          data.push(this.#writeString(cursor[c++]));
          typeTag.push(t);
          break;
        case 'b':
          data.push(this.#writeBlob(cursor[c++]));
          typeTag.push(t);
          break;
        case 'h':
        case 't':
          data.push(this.#writeBigInt(cursor[c++]));
          typeTag.push(t);
          break;
        case 'd':
          data.push(this.#writeDouble(cursor[c++]));
          typeTag.push(t);
          break;
        case 'c':
          data.push(this.#writeChar(cursor[c++]));
          typeTag.push(t);
          break;
        case 'r':
        case 'm':
          data.push(this.#writeUint32(cursor[c++]));
          typeTag.push(t);
          break;
        case 'B':
          typeTag.push(cursor[c++] ? 'T' : 'F');
          break;
        case 'N':
        case 'I':
          typeTag.push(t);
          break;
        case '[':
          typeTag.push(t);
          stack.push([cursor, c + 1]);
          cursor = cursor[c] as any[];
          c = 0;
          break;
        case ']':
          typeTag.push(t);
          [cursor, c] = stack.shift()!;
          break;
        default:
          throw new TypeError(`Invalid type '${t}'`);
      }
    }

    yield this.#writeString(`,${typeTag.join('')}`);
    yield* data;
  }

  #writeInt(value: number): BufferInterface {
    const buf = $Buffer.allocUnsafe(4);
    buf.writeInt32BE(value);
    return buf;
  }

  #writeFloat(value: number): BufferInterface {
    const buf = $Buffer.allocUnsafe(4);
    buf.writeFloatBE(value);
    return buf;
  }

  #writeString(value: string): BufferInterface {
    return $Buffer.from(value.padEnd(4 * Math.ceil((value.length + 1) / 4), '\0'));
  }

  #writeBlob(value: BufferInterface): BufferInterface {
    const size = $Buffer.allocUnsafe(4);
    size.writeInt32BE(value.byteLength);
    return $Buffer.concat([size, value]);
  }

  #writeBigInt(value: bigint): BufferInterface {
    const buf = $Buffer.allocUnsafe(8);
    buf.writeBigInt64BE(value);
    return buf;
  }

  #writeDouble(value: number): BufferInterface {
    const buf = $Buffer.allocUnsafe(8);
    buf.writeDoubleBE(value);
    return buf;
  }

  #writeChar(value: string): BufferInterface {
    return $Buffer.of(0, 0, 0, value.charCodeAt(0));
  }

  #writeUint32(value: OSCMIDIValue | OSCColorValue): BufferInterface {
    const buf = $Buffer.allocUnsafe(4);
    buf.writeUint32BE(value.valueOf() >>> 0);
    return buf;
  }
}
