import { OSCColorValue, OSCMIDIValue } from '../src';

// [rgba, r, g, b, a][]
const colors: [number, number, number, number, number][] = [
  [0x00000000, 0, 0, 0, 0],
  [0x33000000, 0x33, 0x00, 0x00, 0],
  [0x00330000, 0x00, 0x33, 0x00, 0],
  [0x00003300, 0x00, 0x00, 0x33, 0],
  [0x33333300, 0x33, 0x33, 0x33, 0],
];

test('OSCColorValue can be constructed from 32-bit integer', () => {
  for (const [rgba, r, g, b, a] of colors) {
    const color = new OSCColorValue(rgba);
    expect(color.r).toBe(r);
    expect(color.g).toBe(g);
    expect(color.b).toBe(b);
    expect(color.a).toBe(a);
  }
});

test('OSCColorValue.valueOf() properly serializes individual components to a 32-bit integer', () => {
  for (const [rgba, r, g, b, a] of colors) {
    const color = new OSCColorValue(r, g, b, a);
    expect(color.valueOf()).toBe(rgba);
  }
});

// [data, port, status, data1, data2][]
const messages: [number, number, number, number, number][] = [
  [0x00903c7f, 0, 0x90, 60, 127],
  [0x00803c00, 0, 0x80, 60, 0],
  [0x01b0407f, 1, 0xb0, 64, 127],
  [0x01b04000, 1, 0xb0, 64, 0],
];

test('OSCMIDIValue can be constructed from 32-bit integer', () => {
  for (const [data, port, status, d1, d2] of messages) {
    const color = new OSCMIDIValue(data);
    expect(color.port).toBe(port);
    expect(color.status).toBe(status);
    expect(color.data1).toBe(d1);
    expect(color.data2).toBe(d2);
  }
});

test('OSCMIDIValue.valueOf() properly serializes individual components to a 32-bit integer', () => {
  for (const [data, port, status, d1, d2] of colors) {
    const message = new OSCMIDIValue(port, status, d1, d2);
    expect(message.valueOf()).toBe(data);
  }
});
