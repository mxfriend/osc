import { OSCEncoder, OSCDecoder } from '../src';
import { messages } from './types';

test('decode OSC arguments', () => {
  const decoder = new OSCDecoder();

  for (const [packet, message] of messages) {
    const result = [...decoder.decodePacket(packet)];
    expect(result.length).toBe(1);
    expect(result[0]).toEqualCustom(message);
  }
});

test('encode OSC arguments', () => {
  const encoder = new OSCEncoder();

  for (const [packet, message] of messages) {
    const encoded = encoder.encodeMessage(message.address, message.args);
    expect(encoded.equals(packet)).toBe(true);
  }
});
