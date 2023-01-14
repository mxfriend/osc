import { OSCEncoder } from '../src';
import { bundles, messages } from './messages';

test('encodeMessage()', () => {
  const encoder = new OSCEncoder();

  for (const [packet, message] of messages) {
    const encoded = encoder.encodeMessage(message.address, message.args);
    expect(encoded.equals(packet)).toBe(true);
  }
});

test('encodeBundle()', () => {
  const encoder = new OSCEncoder();

  for (const [packet, bundle] of bundles) {
    const encoded = encoder.encodeBundle(bundle.elements, bundle.timetag);
    expect(encoded.equals(packet)).toBe(true);
  }
});
