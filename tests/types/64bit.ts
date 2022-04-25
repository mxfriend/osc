import { OSCMessage } from '../../src';
import { buf, double, nil } from '../test-helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test02', 0,
      ',hdt', nil(4),
      BigInt('0x1020304050607080'),
      double(3.1415926535897932384626433832795028),
      BigInt('0x1121314151617181'),
    ), {
      address: '/test02',
      args: [
        { type: 'h', value: BigInt('0x1020304050607080') },
        { type: 'd', value: 3.1415926535897932384626433832795028 },
        { type: 't', value: BigInt('0x1121314151617181') },
      ],
    },
  ],
];
