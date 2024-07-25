import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { OSCColorValue, OSCMIDIValue } from '../src';

describe('OSC MIDI and color values', () => {
  // [rgba, r, g, b, a][]
  const colors: [number, number, number, number, number][] = [
    [0x00000000, 0, 0, 0, 0],
    [0x33000000, 0x33, 0x00, 0x00, 0],
    [0x00330000, 0x00, 0x33, 0x00, 0],
    [0x00003300, 0x00, 0x00, 0x33, 0],
    [0x33333300, 0x33, 0x33, 0x33, 0],
  ];

  it('OSCColorValue can be constructed from 32-bit integer', () => {
    for (const [rgba, r, g, b, a] of colors) {
      const color = new OSCColorValue(rgba);
      assert.equal(color.r, r);
      assert.equal(color.g, g);
      assert.equal(color.b, b);
      assert.equal(color.a, a);
    }
  });

  it('OSCColorValue.valueOf() properly serializes individual components to a 32-bit integer', () => {
    for (const [rgba, r, g, b, a] of colors) {
      const color = new OSCColorValue(r, g, b, a);
      assert.equal(color.valueOf(), rgba);
    }
  });

  // [data, port, status, data1, data2][]
  const messages: [number, number, number, number, number][] = [
    [0x00903c7f, 0, 0x90, 60, 127],
    [0x00803c00, 0, 0x80, 60, 0],
    [0x01b0407f, 1, 0xb0, 64, 127],
    [0x01b04000, 1, 0xb0, 64, 0],
  ];

  it('OSCMIDIValue can be constructed from 32-bit integer', () => {
    for (const [data, port, status, d1, d2] of messages) {
      const color = new OSCMIDIValue(data);
      assert.equal(color.port, port);
      assert.equal(color.status, status);
      assert.equal(color.data1, d1);
      assert.equal(color.data2, d2);
    }
  });

  it('OSCMIDIValue.valueOf() properly serializes individual components to a 32-bit integer', () => {
    for (const [data, port, status, d1, d2] of colors) {
      const message = new OSCMIDIValue(port, status, d1, d2);
      assert.equal(message.valueOf(), data);
    }
  });
});
