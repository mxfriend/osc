import { Cursor, BufferInterface } from './buffer';
import { osc } from './helpers';
import { OSCArgument, OSCBundle, OSCBundleElement, OSCMessage } from './types';
import { BUNDLE_TAG } from './utils';

export class OSCDecoder {
  private readonly knownAddresses: Set<string> = new Set();
  private checkKnown: boolean = false;

  public addKnownAddress(address: string): void {
    this.knownAddresses.add(address);
    this.checkKnown = true;
  }

  public removeKnownAddress(address: string): void {
    this.knownAddresses.delete(address);
    this.checkKnown = this.knownAddresses.size > 0;
  }

  public removeAllKnownAddresses(): void {
    this.knownAddresses.clear();
    this.checkKnown = false;
  }

  public * decodePacket(packet: BufferInterface, full: boolean = false): IterableIterator<OSCBundleElement> {
    const cursor = new Cursor();
    const address: string = this.scanStr(packet, cursor);

    if (!full && this.checkKnown) {
      if (address === BUNDLE_TAG) {
        yield * this.scanBundle(packet, cursor);
      } else if (this.knownAddresses.has(address)) {
        yield this.decodeMessage(packet, address, cursor);
      }
    } else if (address === BUNDLE_TAG) {
      yield this.decodeBundle(packet, cursor);
    } else {
      yield this.decodeMessage(packet, address, cursor);
    }
  }

  private * scanBundle(packet: BufferInterface, cursor: Cursor): IterableIterator<OSCBundleElement> {
    cursor.inc(8); // skip timetag

    while (cursor.index < packet.byteLength) {
      yield * this.decodePacket(this.scanBlob(packet, cursor));
    }
  }

  private decodeBundle(packet: BufferInterface, cursor: Cursor): OSCBundle {
    const elements: (OSCBundle | OSCMessage)[] = [];
    const timetag = packet.readBigInt64BE(cursor.inc(8));

    while (cursor.index < packet.byteLength) {
      elements.push(...this.decodePacket(this.scanBlob(packet, cursor), true));
    }

    return { elements, timetag };
  }

  private decodeMessage(packet: BufferInterface, address: string, cursor: Cursor): OSCMessage {
    const args: OSCArgument[] = [];

    if (cursor.index >= packet.byteLength || packet[cursor.index] !== 0x2c) { // ","
      return { address, args };
    }

    cursor.inc(1);
    const types = this.scanStr(packet, cursor);
    const stack: OSCArgument[][] = [];
    let arr: OSCArgument[] = args;

    for (let i = 0; i < types.length; ++i) {
      switch (types[i]) {
        case 'i':
          arr.push(osc.int(packet.readInt32BE(cursor.inc(4))));
          break;
        case 'f':
          arr.push(osc.float(packet.readFloatBE(cursor.inc(4))));
          break;
        case 's':
        case 'S':
          arr.push({ type: types[i] as any, value: this.scanStr(packet, cursor) });
          break;
        case 'b':
          arr.push(osc.blob(this.scanBlob(packet, cursor)));
          break;
        case 'h':
        case 't':
          arr.push({ type: types[i] as any, value: packet.readBigInt64BE(cursor.inc(8)) });
          break;
        case 'd':
          arr.push(osc.double(packet.readDoubleBE(cursor.inc(8))));
          break;
        case 'c':
          cursor.inc(3);
          arr.push(osc.char(String.fromCharCode(packet.readUint8(cursor.inc(1)))));
          break;
        case 'r':
          arr.push(osc.color(packet.readUint32BE(cursor.inc(4))));
          break;
        case 'm':
          arr.push(osc.midi(packet.readUint32BE(cursor.inc(4))));
          break;
        case 'T':
          arr.push(osc.bool(true));
          break;
        case 'F':
          arr.push(osc.bool(false));
          break;
        case 'N':
          arr.push(osc.null());
          break;
        case 'I':
          arr.push(osc.infinity());
          break;
        case '[': {
          const arg = osc.array();
          arr.push(arg);
          stack.push(arr);
          arr = arg.value;
          break;
        }
        case ']': {
          const prev = stack.pop();

          if (prev) {
            arr = prev;
          } else {
            throw new Error("Mismatched ']' in OSC type tag list");
          }
          break;
        }
        default:
          throw new Error(`Unknown OSC type: '${types[i]}'`);
      }
    }

    if (stack.length) {
      throw new Error("Mismatched '[' in OSC type tag list");
    }

    return { address, args };
  }

  private scanStr(packet: BufferInterface, cursor: Cursor): string {
    const start = cursor.index;

    for (; cursor.index < packet.length; ++cursor.index) {
      if (packet[cursor.index] === 0) {
        const str = packet.subarray(start, cursor.index).toString('ascii');
        cursor.inc(4 - cursor.index % 4);
        return str;
      }
    }

    return packet.subarray(start).toString('ascii');
  }

  private scanBlob(packet: BufferInterface, cursor: Cursor): BufferInterface {
    const length = packet.readInt32BE(cursor.inc(4));
    const buf = packet.subarray(cursor.index, cursor.index + length);
    cursor.inc(length);
    return buf;
  }
}
