import { OSCDecoder, OSCEncoder } from '../src';
import { bundles, messages } from './messages';

test('decodePacket() with OSC messages', () => {
  const decoder = new OSCDecoder();

  for (const [packet, message] of messages) {
    const result = [...decoder.decodePacket(packet)];
    expect(result.length).toBe(1);
    expect(result[0]).toEqualCustom(message);
  }
});

test('decodePacket() with OSC bundles', () => {
  const decoder = new OSCDecoder();

  for (const [packet, bundle] of bundles) {
    const result = [...decoder.decodePacket(packet)];
    expect(result.length).toBe(1);
    expect(result[0]).toEqualCustom(bundle);
  }
});

test('decodePacket() with known addresses (messages)', () => {
  const encoder = new OSCEncoder();
  const decoder = new OSCDecoder();
  const addresses = [
    '/foo/one/bar',
    '/foo/one/baz',
    '/foo/other/baz',
    '/foo/other/thing',
    '/bar/1',
    '/bar/9',
    '/bar/smth/else',
    '/a/b/c/and-smth-more/d/e/f',
  ];
  const tests = {
    '/foo/*': 4,
    '/foo/one/ba?': 2,
    '/foo/{one,other}/baz': 2,
    '/bar/[0-9]': 2,
    '/bar/[!0-9]': 1,
    '*/smth/*': 1,
    '*smth*': 2,
  };

  for (const [pattern, expectedMatches] of Object.entries(tests)) {
    decoder.addKnownAddress(pattern);

    const result = addresses
      .map((address) => encoder.encodeMessage(address))
      .flatMap((packet) => [...decoder.decodePacket(packet)]);

    decoder.removeAllKnownAddresses();
    expect(result.length).toBe(expectedMatches);
  }
});
