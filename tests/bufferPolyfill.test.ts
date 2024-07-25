import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { BufferPolyfill } from '../src';

describe('Buffer polyfill', () => {
  it('can be created from raw string', () => {
    const value = BufferPolyfill.from('abcd 1234 !#$');
    assert.ok(Buffer.from('abcd 1234 !#$').equals(value));
  });

  it('can be created from hex string', () => {
    const value = BufferPolyfill.from('badaff0909', 'hex');
    assert.ok(Buffer.from('badaff0909', 'hex').equals(value));
  });

  it('can be created from ArrayBuffer', () => {
    const src = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const value = BufferPolyfill.from(src.buffer);
    assert.ok(Buffer.from(src).equals(value));
  });
});
