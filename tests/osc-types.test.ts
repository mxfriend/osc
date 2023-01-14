import { decodePacket, encodeMessage } from '../src';
import { messages } from './types';

test('decode OSC arguments', () => {
  for (const [packet, message] of messages) {
    expect(decodePacket(packet)).toEqualCustom(message);
  }
});

test('encode OSC arguments', () => {
  for (const [packet, message] of messages) {
    const encoded = encodeMessage(message.address, message.args);
    expect(encoded.equals(packet)).toBe(true);
  }
});
