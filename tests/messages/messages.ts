import type { OSCMessage } from '../../src';
import { buf, int32, nil } from '../lib/helpers';

export const messages: [Buffer, OSCMessage][] = [
  [buf('/foo/ba', 0, ',', nil(3)), { address: '/foo/ba', types: '', values: [] }],
  [buf('/foo/bar', nil(4), ',', nil(3)), { address: '/foo/bar', types: '', values: [] }],
  [
    buf('/test', nil(3), ',i', nil(2), int32(0x01020304)),
    { address: '/test', types: 'i', values: [0x01020304] },
  ],
];
