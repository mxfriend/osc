import type { BufferInterface } from '../buffer';
import { Cursor } from '../buffer';
import type { Subscription } from '../subscriptions';
import { SubscriptionManager } from '../subscriptions';
import type { OSCBundle, OSCBundleElement, OSCMessage } from '../types';
import { OSCColorValue, OSCMIDIValue } from '../types';
import { BUNDLE_TAG } from './utils';

export type DecodeResult<Peer = unknown> = [OSCBundle] | [OSCMessage, Subscription<Peer>?];

export class OSCDecoder<Peer = unknown> {
  readonly #subscriptions: SubscriptionManager<Peer>;

  constructor(subscriptions: SubscriptionManager<Peer> = new SubscriptionManager()) {
    this.#subscriptions = subscriptions;
  }

  public *decodePacket(
    packet: BufferInterface,
    full: boolean = false,
  ): IterableIterator<DecodeResult<Peer>> {
    const cursor = new Cursor();
    const address: string = this.decodeStr(packet, cursor);

    if (!full && !this.#subscriptions.isEmpty()) {
      if (address === BUNDLE_TAG) {
        yield* this.scanBundle(packet, cursor);
      } else {
        const subscription = this.#subscriptions.get(address);

        if (subscription) {
          yield [this.decodeMessage(packet, address, cursor), subscription];
        }
      }
    } else if (address === BUNDLE_TAG) {
      yield [this.decodeBundle(packet, cursor)];
    } else {
      yield [this.decodeMessage(packet, address, cursor)];
    }
  }

  private *scanBundle(
    packet: BufferInterface,
    cursor: Cursor,
  ): IterableIterator<DecodeResult<Peer>> {
    cursor.inc(8); // skip timetag

    while (cursor.index < packet.byteLength) {
      yield* this.decodePacket(this.decodeBlob(packet, cursor));
    }
  }

  private decodeBundle(packet: BufferInterface, cursor: Cursor): OSCBundle {
    const elements: OSCBundleElement[] = [];
    const timetag = packet.readBigInt64BE(cursor.inc(8));

    while (cursor.index < packet.byteLength) {
      for (const [element] of this.decodePacket(this.decodeBlob(packet, cursor), true)) {
        elements.push(element);
      }
    }

    return { elements, timetag };
  }

  private decodeMessage(packet: BufferInterface, address: string, cursor: Cursor): OSCMessage {
    if (cursor.index >= packet.byteLength || packet[cursor.index] !== 0x2c) {
      // ","
      return { address, types: '', values: [] };
    }

    cursor.inc(1); // skip ","

    const typeTag = this.decodeStr(packet, cursor);
    const types = typeTag.replace(/[TF]/g, 'B');

    if (typeTag === '') {
      return { address, types, values: [] };
    }

    const message = { address, types };
    const argMap = [...this.scanTypes(packet, typeTag, cursor)];
    let values: any[];

    Object.defineProperty(message, 'values', {
      enumerable: true,
      configurable: true,
      get: (): any => {
        return (values ??= this.decodeArgs(packet, argMap));
      },
    });

    return message as OSCMessage;
  }

  private *scanTypes(
    packet: BufferInterface,
    types: string,
    cursor: Cursor,
  ): IterableIterator<[string, number, number?]> {
    for (const t of types) {
      switch (t) {
        case 'i':
        case 'f':
        case 'r':
        case 'm':
          yield [t, cursor.inc(4)];
          break;
        case 's':
        case 'S':
          yield [t, ...this.scanStr(packet, cursor)];
          break;
        case 'b':
          yield [t, ...this.scanBlob(packet, cursor)];
          break;
        case 'h':
        case 't':
        case 'd':
          yield [t, cursor.inc(8)];
          break;
        case 'c':
          cursor.inc(3);
          yield [t, cursor.inc(1)];
          break;
        case 'T':
        case 'F':
        case 'N':
        case 'I':
        case '[':
        case ']':
          // no data in payload
          yield [t, 0];
          break;
        default:
          throw new Error(`Unknown OSC type: '${t}'`);
      }
    }
  }

  private decodeArgs(packet: BufferInterface, map: [string, number, number?][]): any[] {
    const values: any[] = [];
    const stack: any[][] = [];
    let cursor: any[] = values;

    for (const [type, start, end] of map) {
      switch (type) {
        case 'i':
          cursor.push(packet.readInt32BE(start));
          break;
        case 'f':
          cursor.push(packet.readFloatBE(start));
          break;
        case 's':
        case 'S':
          cursor.push(packet.subarray(start, end).toString('ascii'));
          break;
        case 'b':
          cursor.push(packet.subarray(start, end));
          break;
        case 'h':
        case 't':
          cursor.push(packet.readBigInt64BE(start));
          break;
        case 'd':
          cursor.push(packet.readDoubleBE(start));
          break;
        case 'c':
          cursor.push(String.fromCharCode(packet.readUint8(start)));
          break;
        case 'r':
          cursor.push(new OSCColorValue(packet.readUint32BE(start)));
          break;
        case 'm':
          cursor.push(new OSCMIDIValue(packet.readUint32BE(start)));
          break;
        case 'T':
          cursor.push(true);
          break;
        case 'F':
          cursor.push(false);
          break;
        case 'N':
          cursor.push(null);
          break;
        case 'I':
          cursor.push(Infinity);
          break;
        case '[': {
          const arr: any[] = [];
          cursor.push(arr);
          stack.push(cursor);
          cursor = arr;
          break;
        }
        case ']': {
          const prev = stack.pop();

          if (prev) {
            cursor = prev;
          } else {
            throw new Error("Mismatched ']' in OSC type tag list");
          }
          break;
        }
        default:
          throw new Error(`Unknown OSC type: '${type}'`);
      }
    }

    if (stack.length) {
      throw new Error("Mismatched '[' in OSC type tag list");
    }

    return values;
  }

  private decodeStr(packet: BufferInterface, cursor: Cursor): string {
    const [start, end] = this.scanStr(packet, cursor);
    return packet.subarray(start, end).toString('ascii');
  }

  private decodeBlob(packet: BufferInterface, cursor: Cursor): BufferInterface {
    const [start, end] = this.scanBlob(packet, cursor);
    return packet.subarray(start, end);
  }

  private scanStr(packet: BufferInterface, cursor: Cursor): [number, number] {
    const start = cursor.index;

    for (; cursor.index < packet.length; ++cursor.index) {
      if (packet[cursor.index] === 0) {
        return [start, cursor.inc(4 - (cursor.index % 4))];
      }
    }

    return [start, cursor.index];
  }

  private scanBlob(packet: BufferInterface, cursor: Cursor): [number, number] {
    const length = packet.readInt32BE(cursor.inc(4));
    const start = cursor.inc(length);
    return [start, cursor.index];
  }
}
