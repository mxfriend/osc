import { OSCMessage } from '../../src';
import { buf, int32, nil } from '../test-helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test01', 0,
      ',ifsb', nil(3),
      int32(0x01020304),
      0x3e, 0xed, 0xfa, 0x44,
      "foo bar baz", 0,
      int32(24), Buffer.from('24 bytes of data........'),
    ), {
      address: '/test01',
      args: [
        { type: 'i', value: 0x01020304 },
        { type: 'f', value: 0.4648 },
        { type: 's', value: 'foo bar baz' },
        { type: 'b', value: Buffer.from('24 bytes of data........') },
      ],
    },
  ],
];
