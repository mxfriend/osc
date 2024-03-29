import { $Buffer, BufferInterface } from './buffer';
import { isMessage, OSCArgument, OSCBundleElement } from './types';
import { BUNDLE_TAG, nonempty } from './utils';

export class OSCEncoder {
  constructor() {
    this.encodeBundleElement = this.encodeBundleElement.bind(this);
    this.writeArg = this.writeArg.bind(this);
    this.writeType = this.writeType.bind(this);
  }

  public encodeMessage(address: string, args?: OSCArgument[]): BufferInterface {
    if (!args || !args.length) {
      return $Buffer.concat([
        this.writeStr(address),
        this.writeStr(','),
      ]);
    }

    return $Buffer.concat([
      this.writeStr(address),
      this.writeStr(',' + args.map(this.writeType).join('')),
      ...args.map(this.writeArg).filter(nonempty),
    ]);
  }

  public encodeBundle(elements: OSCBundleElement[], timetag?: bigint): BufferInterface {
    return $Buffer.concat([
      this.writeStr(BUNDLE_TAG),
      this.writeBigint(timetag ?? 1n),
      ...elements.flatMap(this.encodeBundleElement),
    ]);
  }

  private encodeBundleElement(element: OSCBundleElement): BufferInterface[] {
    const data = isMessage(element)
      ? this.encodeMessage(element.address, element.args)
      : this.encodeBundle(element.elements, element.timetag);
    return [this.writeInt(data.byteLength), data];
  }

  private writeStr(str: string): BufferInterface {
    return $Buffer.from(str.concat('\0').padEnd(4 * Math.ceil((str.length + 1) / 4), '\0'));
  }

  private writeBlob(blob: BufferInterface): BufferInterface {
    const buf = $Buffer.allocUnsafe(blob.byteLength + 4);
    buf.writeInt32BE(blob.byteLength);
    buf.set(blob, 4);
    return buf;
  }

  private writeInt(value: number): BufferInterface {
    const buf = $Buffer.allocUnsafe(4);
    buf.writeInt32BE(value);
    return buf;
  }

  private writeFloat(value: number): BufferInterface {
    const buf = $Buffer.allocUnsafe(4);
    buf.writeFloatBE(value);
    return buf;
  }

  private writeBigint(value: bigint): BufferInterface {
    const buf = $Buffer.allocUnsafe(8);
    buf.writeBigInt64BE(value);
    return buf;
  }

  private writeDouble(value: number): BufferInterface {
    const buf = $Buffer.allocUnsafe(8);
    buf.writeDoubleBE(value);
    return buf;
  }

  private writeChar(value: string): BufferInterface {
    const c = value.charCodeAt(0);

    if (c > 127) {
      throw new Error(`Character '${value}' is outside ASCII range`);
    }

    return $Buffer.of(0, 0, 0, c);
  }

  private writeUint(value: number): BufferInterface {
    const buf = $Buffer.allocUnsafe(4);
    buf.writeUint32BE(value >>> 0);
    return buf;
  }

  private writeArg(arg: OSCArgument): BufferInterface | null {
    switch (arg.type) {
      case 'i': return this.writeInt(arg.value);
      case 'f': return this.writeFloat(arg.value);
      case 's':
      case 'S':
        return this.writeStr(arg.value);
      case 'b':
        return this.writeBlob(arg.value);
      case 'h':
      case 't':
        return this.writeBigint(arg.value);
      case 'd':
        return this.writeDouble(arg.value);
      case 'c':
        return this.writeChar(arg.value);
      case 'r':
      case 'm':
        return this.writeUint(arg.value.valueOf());
      case 'B':
      case 'N':
      case 'I':
        return null;
      case 'a':
        return $Buffer.concat(arg.value.map(this.writeArg).filter(nonempty));
      default:
        throw new TypeError(`Unknown OSC type: '${(arg as any).type}'`);
    }
  }

  private writeType(arg: OSCArgument): string {
    switch (arg.type) {
      case 'B': return arg.value ? 'T' : 'F';
      case 'a': return '[' + arg.value.map(this.writeType).join('') + ']';
      default: return arg.type;
    }
  }
}
