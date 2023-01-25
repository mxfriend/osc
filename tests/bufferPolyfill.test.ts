import { BufferPolyfill } from '../src';
import './test-helpers';

test('can be created from raw string', () => {
  expect(BufferPolyfill.from('abcd 1234 !#$')).toEqualCustom(Buffer.from('abcd 1234 !#$'));
});

test('can be created from hex string', () => {
  expect(BufferPolyfill.from('badaff0909', 'hex')).toEqualCustom(Buffer.from('badaff0909', 'hex'));
});

test('can be created from ArrayBuffer', () => {
  const src = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  expect(BufferPolyfill.from(src.buffer)).toEqualCustom(src);
});
