import type { OSCBundle } from '../../src';
import { buf, int32 } from '../lib/helpers';
import { messages } from './messages';

export const bundles: [Buffer, OSCBundle][] = [
  [
    buf('#bundle', 0, BigInt('0x1234567812345678')),
    { elements: [], timetag: BigInt('0x1234567812345678') },
  ],
  [
    buf(
      '#bundle',
      0,
      BigInt('0x1234567812345678'),
      ...messages.flatMap(([b]) => [int32(b.byteLength), b]),
    ),
    {
      elements: messages.map(([, m]) => m),
      timetag: BigInt('0x1234567812345678'),
    },
  ],
];
