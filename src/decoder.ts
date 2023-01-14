import { OSCArgument, OSCArray, OSCBundle, OSCBundleElement, OSCMessage } from './types';
import { BUNDLE_TAG } from './utils';
import { OSCColorValue, OSCMIDIValue } from './values';

type Cursor = { index: number };

export class OSCDecoder {
  private readonly knownAddresses: Set<string> = new Set();
  private readonly knownAddressPatterns: Map<string, RegExp> = new Map();
  private checkKnown: boolean = false;

  public addKnownAddress(address: string): void {
    for (const [addr, pattern] of parseKnownAddress(address)) {
      if (pattern) {
        this.knownAddressPatterns.set(addr, pattern);
      } else {
        this.knownAddresses.add(addr);
      }
    }

    this.checkKnown = true;
  }

  public removeKnownAddress(address: string): void {
    for (const [addr, pattern] of parseKnownAddress(address, false)) {
      if (pattern) {
        this.knownAddressPatterns.delete(addr);
      } else {
        this.knownAddresses.delete(addr);
      }
    }

    this.checkKnown = this.knownAddresses.size > 0 || this.knownAddressPatterns.size > 0;
  }

  public removeAllKnownAddresses(): void {
    this.knownAddresses.clear();
    this.knownAddressPatterns.clear();
    this.checkKnown = false;
  }

  public * decodePacket(packet: Buffer, full: boolean = false): IterableIterator<OSCBundleElement> {
    const cursor: Cursor = { index: 0 };
    const address: string = this.scanStr(packet, cursor);

    if (!full && this.checkKnown) {
      if (address === BUNDLE_TAG) {
        yield * this.scanBundle(packet, cursor);
      } else if (this.isKnownAddress(address)) {
        yield this.decodeMessage(packet, address, cursor);
      }
    } else if (address === BUNDLE_TAG) {
      yield this.decodeBundle(packet, cursor);
    } else {
      yield this.decodeMessage(packet, address, cursor);
    }
  }

  private * scanBundle(packet: Buffer, cursor: Cursor): IterableIterator<OSCBundleElement> {
    cursor.index += 8; // skip timetag

    while (cursor.index < packet.byteLength) {
      yield * this.decodePacket(this.scanBlob(packet, cursor));
    }
  }

  private decodeBundle(packet: Buffer, cursor: Cursor): OSCBundle {
    const elements: (OSCBundle | OSCMessage)[] = [];
    const timetag = packet.readBigInt64BE(cursor.index);
    cursor.index += 8;

    while (cursor.index < packet.byteLength) {
      elements.push(...this.decodePacket(this.scanBlob(packet, cursor), true));
    }

    return { elements, timetag };
  }

  private decodeMessage(packet: Buffer, address: string, cursor: Cursor): OSCMessage {
    const args: OSCArgument[] = [];

    if (cursor.index >= packet.byteLength || packet[cursor.index] !== 0x2c) { // ","
      return { address, args };
    }

    ++cursor.index;
    const types = this.scanStr(packet, cursor);
    const stack: OSCArgument[][] = [];
    let arr: OSCArgument[] = args;

    for (let i = 0; i < types.length; ++i) {
      switch (types[i]) {
        case 'i':
          arr.push({ type: 'i', value: packet.readInt32BE(cursor.index) });
          cursor.index += 4;
          break;
        case 'f':
          arr.push({ type: 'f', value: packet.readFloatBE(cursor.index) });
          cursor.index += 4;
          break;
        case 's':
        case 'S':
          arr.push({ type: types[i] as any, value: this.scanStr(packet, cursor) });
          break;
        case 'b':
          arr.push({ type: 'b', value: this.scanBlob(packet, cursor) });
          break;
        case 'h':
        case 't':
          arr.push({ type: types[i] as any, value: packet.readBigInt64BE(cursor.index) });
          cursor.index += 8;
          break;
        case 'd':
          arr.push({ type: 'd', value: packet.readDoubleBE(cursor.index) });
          cursor.index += 8;
          break;
        case 'c':
          arr.push({ type: 'c', value: String.fromCharCode(packet.readUint8(cursor.index + 3)) });
          cursor.index += 4;
          break;
        case 'r':
          arr.push({ type: 'r', value: new OSCColorValue(packet.readUint32BE(cursor.index)) });
          cursor.index += 4;
          break;
        case 'm':
          arr.push({ type: 'm', value: new OSCMIDIValue(packet.readUint32BE(cursor.index)) });
          cursor.index += 4;
          break;
        case 'T':
          arr.push({ type: 'B', value: true });
          break;
        case 'F':
          arr.push({ type: 'B', value: false });
          break;
        case 'N':
          arr.push({ type: 'N', value: null });
          break;
        case 'I':
          arr.push({ type: 'I', value: Infinity });
          break;
        case '[': {
          const arg: OSCArray = { type: 'a', value: [] };
          arr.push(arg);
          stack.push(arr);
          arr = arg.value;
          break;
        }
        case ']': {
          const prev = stack.shift();

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

  private scanStr(packet: Buffer, cursor: Cursor): string {
    const start = cursor.index;

    for (; cursor.index < packet.length; ++cursor.index) {
      if (packet[cursor.index] === 0) {
        const str = packet.slice(start, cursor.index).toString('ascii');
        cursor.index += 4 - cursor.index % 4;
        return str;
      }
    }

    return packet.slice(start).toString('ascii');
  }

  private scanBlob(packet: Buffer, cursor: Cursor): Buffer {
    const length = packet.readInt32BE(cursor.index);
    const buf = packet.slice(cursor.index + 4, cursor.index + 4 + length);
    cursor.index += 4 + length;
    return buf;
  }

  private isKnownAddress(address: string): boolean {
    if (this.knownAddresses.has(address)) {
      return true;
    }

    for (const pattern of this.knownAddressPatterns.values()) {
      if (pattern.test(address)) {
        return true;
      }
    }

    return false;
  }
}

function parseKnownAddress(address: string, withRE: false): IterableIterator<[string, boolean]>;
function parseKnownAddress(address: string, withRE?: true): IterableIterator<[string, RegExp | false]>;
function * parseKnownAddress(address: string, withRE: boolean = true): IterableIterator<[string, RegExp | boolean]> {
  const match = address.match(/^([^?*[\]{}]*){([^?*[\]{}]+)}([^?*[\]{}]*)$/);

  if (match) {
    const tokens = match[2].split(/,/g);

    for (const token of tokens) {
      for (const [addr] of parseKnownAddress(match[3], false)) {
        yield [match[1] + token + addr, false];
      }
    }
  } else if (/[?*[\]{}]/.test(address)) {
    if (!withRE) {
      yield [address, true];
    } else {
      const pattern = escapePattern(address).replace(/(\\\?)|(\\\*)|\\\[([^\]]+)\\]|\\{([^}]+)\\}/g, (_, q, a, ch, tok) => {
        if (q) {
          return '.';
        } else if (a) {
          return '.*';
        } else if (ch) {
          return `[${ch.replace(/\\-/g, '-').replace(/^!/, '^')}]`;
        } else {
          return `(?:${tok.replace(/,/g, '|')})`;
        }
      });

      yield [address, new RegExp(pattern)];
    }
  } else {
    yield [address, false];
  }
}

function escapePattern(pattern: string): string {
  return pattern.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
