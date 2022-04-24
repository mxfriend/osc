import { OSCBundle } from '../dist';
import { OSCMessage } from '../src';
import { decode, encodeMessage, encodeBundle } from '../src/utils';

function nil(n: number): Buffer {
  return Buffer.alloc(n);
}

function buf(...items: (number | string | Buffer)[]): Buffer {
  return Buffer.concat(items.map((item) => {
    switch (typeof item) {
      case 'string': return Buffer.from(item);
      case 'number': return Buffer.of(item);
      default: return item;
    }
  }));
}

const messages: [Buffer, OSCMessage][] = [
  [buf('/foo/ba', 0), { address: '/foo/ba', args: [] }],
  [buf('/foo/bar', nil(4)), { address: '/foo/bar', args: [] }],
  [buf('/test', nil(3), ',i', nil(2), 0x01, 0x02, 0x03, 0x04), { address: '/test', args: [ { type: 'i', value: 0x01020304 } ] }],
];

const bundles: [Buffer, OSCBundle][] = [
  [buf('#bundle', 0, 0x12, 0x34, 0x56, 0x78, 0x12, 0x34, 0x56, 0x78), { elements: [], timetag: BigInt('0x1234567812345678') }]
];

test('decode() OSC messages', () => {
  for (const [packet, message] of messages) {
    const [type, decoded] = decode(packet);
    expect(type).toBe('message');
    expect(decoded).toEqual(message);
  }
});

test('decode() OSC bundles', () => {
  for (const [packet, bundle] of bundles) {
    const [type, decoded] = decode(packet);
    expect(type).toBe('bundle');
    expect(decoded).toEqual(bundle);
  }
});

test('encodeMessage()', () => {
  for (const [packet, message] of messages) {
    const encoded = encodeMessage(message);
    expect(encoded.equals(packet)).toBe(true);
  }
});

test('encodeBundle()', () => {
  for (const [packet, bundle] of bundles) {
    const encoded = encodeBundle(bundle);
    expect(encoded.equals(packet)).toBe(true);
  }
});
