import { OSCMessage } from '../../src';
import { buf, int32, nil } from '../test-helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test05', 0,
      ',s[ifTb]s', nil(3),
      'string before array', 0,
      int32(12345),
      0x3e, 0xed, 0xfa, 0x44,
      int32(16), Buffer.from('16 bytes of data'),
      'string after array', nil(2),
    ),
    {
      address: '/test05',
      args: [
        { type: 's', value: 'string before array' },
        {
          type: 'a',
          value: [
            { type: 'i', value: 12345 },
            { type: 'f', value: 0.4648 },
            { type: 'B', value: true },
            { type: 'b', value: Buffer.from('16 bytes of data') },
          ],
        },
        { type: 's', value: 'string after array' },
      ],
    },
  ],
];
