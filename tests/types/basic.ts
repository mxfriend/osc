import type { OSCMessage } from '../../src';
import { buf, int32, nil } from '../lib/helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test01',
      0,
      ',ifsb',
      nil(3),
      int32(0x01020304),
      0x3e,
      0xed,
      0xfa,
      0x44,
      'foo bar baz',
      0,
      int32(24),
      Buffer.from('24 bytes of data........'),
    ),
    {
      address: '/test01',
      types: 'ifsb',
      values: [0x01020304, 0.4648, 'foo bar baz', Buffer.from('24 bytes of data........')],
    },
  ],
];
