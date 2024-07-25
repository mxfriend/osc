import type { OSCMessage } from '../../src';
import { buf, int32, nil } from '../lib/helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test05',
      0,
      ',s[ifTb]s',
      nil(3),
      'string before array',
      0,
      int32(12345),
      0x3e,
      0xed,
      0xfa,
      0x44,
      int32(16),
      Buffer.from('16 bytes of data'),
      'string after array',
      nil(2),
    ),
    {
      address: '/test05',
      types: 's[ifBb]s',
      values: [
        'string before array',
        [12345, 0.4648, true, Buffer.from('16 bytes of data')],
        'string after array',
      ],
    },
  ],
];
