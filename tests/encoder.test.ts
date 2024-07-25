import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { OSCEncoder } from '../src';
import { bundles, messages } from './messages';

describe('OSC Encoder', () => {
  it('encodeMessage()', () => {
    const encoder = new OSCEncoder();

    for (const [packet, message] of messages) {
      const encoded = encoder.encodeMessage(message.address, message.types, message.values);
      assert.ok(encoded.equals(packet));
    }
  });

  it('encodeBundle()', () => {
    const encoder = new OSCEncoder();

    for (const [packet, bundle] of bundles) {
      const encoded = encoder.encodeBundle(bundle.elements, bundle.timetag);
      assert.ok(encoded.equals(packet));
    }
  });
});
