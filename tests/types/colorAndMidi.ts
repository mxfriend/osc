import { OSCColorValue, OSCMIDIValue } from '../../dist';
import { OSCMessage } from '../../src';
import { buf, uint32 } from '../test-helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test03', 0,
      ',rm', 0,
      uint32(0xaabbcc99),
      uint32(0x0190407f),
    ), {
      address: '/test03',
      args: [
        { type: 'r', value: new OSCColorValue(0xaa, 0xbb, 0xcc, 0x99) },
        { type: 'm', value: new OSCMIDIValue(1, 0x90, 0x40, 0x7f) }
      ],
    },
  ],
];
