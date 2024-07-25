import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { OSCDecoder } from '../src';
import { bundles, messages } from './messages';

describe('OSC Decoder', () => {
  it('decodePacket() with OSC messages', () => {
    const decoder = new OSCDecoder();

    for (const [packet, message] of messages) {
      const result = [...decoder.decodePacket(packet)];
      assert.equal(result.length, 1);
      assert(Array.isArray(result[0]));
      assert.equal(result[0].length, 1);
      assert.deepEqual(result[0][0], message);
    }
  });

  it('decodePacket() with OSC bundles', () => {
    const decoder = new OSCDecoder();

    for (const [packet, bundle] of bundles) {
      const result = [...decoder.decodePacket(packet)];
      assert.equal(result.length, 1);
      assert(Array.isArray(result[0]));
      assert.equal(result[0].length, 1);
      assert.deepEqual(result[0][0], bundle);
    }
  });
});
