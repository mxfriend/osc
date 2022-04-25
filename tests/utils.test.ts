import { OSCMessage, OSCBundle } from '../src';
import { decode, encodeMessage, encodeBundle } from '../src/utils';
import { buf, int32, nil } from './test-helpers';

const messages: [Buffer, OSCMessage][] = [
  [buf('/foo/ba', 0), { address: '/foo/ba', args: [] }],
  [buf('/foo/bar', nil(4)), { address: '/foo/bar', args: [] }],
  [buf('/test', nil(3), ',i', nil(2), int32(0x01020304)), { address: '/test', args: [ { type: 'i', value: 0x01020304 } ] }],
];

const bundles: [Buffer, OSCBundle][] = [
  [buf('#bundle', 0, BigInt('0x1234567812345678')), { elements: [], timetag: BigInt('0x1234567812345678') }],
  [
    buf(
      '#bundle', 0, BigInt('0x1234567812345678'),
      ...messages.flatMap(([b]) => [int32(b.byteLength), b]),
    ),
    {
      elements: messages.map(([, m]) => m),
      timetag: BigInt('0x1234567812345678'),
    },
  ],
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
