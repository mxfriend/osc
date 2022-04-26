import { decode, encodeMessage } from '../src/utils';
import { messages } from './types';

test('decode OSC arguments', () => {
  for (const [packet, message] of messages) {
    const [type, decoded] = decode(packet);
    expect(type).toBe('message');
    expect(decoded).toEqualCustom(message);
  }
});

test('encode OSC arguments', () => {
  for (const [packet, message] of messages) {
    const encoded = encodeMessage(message.address, message.args);
    expect(encoded.equals(packet)).toBe(true);
  }
});
