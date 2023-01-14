import { OSCMessage, OSCBundle, decodePacket, encodeMessage, encodeBundle } from '../src';
import { buf, int32, nil } from './test-helpers';

const messages: [Buffer, OSCMessage][] = [
  [buf('/foo/ba', 0, ',', nil(3)), { address: '/foo/ba', args: [] }],
  [buf('/foo/bar', nil(4), ',', nil(3)), { address: '/foo/bar', args: [] }],
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

test('decodePacket() with OSC messages', () => {
  for (const [packet, message] of messages) {
    expect(decodePacket(packet)).toEqualCustom(message);
  }
});

test('decodePacket() with OSC bundles', () => {
  for (const [packet, bundle] of bundles) {
    expect(decodePacket(packet)).toEqualCustom(bundle);
  }
});

test('encodeMessage()', () => {
  for (const [packet, message] of messages) {
    const encoded = encodeMessage(message.address, message.args);
    expect(encoded.equals(packet)).toBe(true);
  }
});

test('encodeBundle()', () => {
  for (const [packet, bundle] of bundles) {
    const encoded = encodeBundle(bundle.elements, bundle.timetag);
    expect(encoded.equals(packet)).toBe(true);
  }
});
