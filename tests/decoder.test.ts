import { OSCDecoder } from '../src';
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
