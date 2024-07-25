import type { OSCMessage } from '../../src';
import { buf, double, nil } from '../lib/helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test02',
      0,
      ',hdt',
      nil(4),
      BigInt('0x1020304050607080'),
      double(3.141592653589793),
      BigInt('0x1121314151617181'),
    ),
    {
      address: '/test02',
      types: 'hdt',
      values: [BigInt('0x1020304050607080'), 3.141592653589793, BigInt('0x1121314151617181')],
    },
  ],
];
