import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { OSCDecoder, OSCEncoder } from '../src';
import { assertDeeplyEqual } from './lib/helpers';
import { messages } from './types';

describe('OSC encoder and decoder', () => {
  it('decodes OSC arguments', () => {
    const decoder = new OSCDecoder();

    for (const [packet, message] of messages) {
      const result = [...decoder.decodePacket(packet)];
      assert.equal(result.length, 1);
      assert(Array.isArray(result[0]));
      assert.equal(result[0].length, 1);
      assertDeeplyEqual(result[0][0], message);
    }
  });

  it('encodes OSC arguments', () => {
    const encoder = new OSCEncoder();

    for (const [packet, message] of messages) {
      const encoded = encoder.encodeMessage(message.address, message.types, message.values);
      assertDeeplyEqual(encoded, packet);
    }
  });
});
