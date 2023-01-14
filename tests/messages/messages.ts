import { OSCMessage } from '../../src';
import { buf, int32, nil } from '../test-helpers';

export const messages: [Buffer, OSCMessage][] = [
  [buf('/foo/ba', 0, ',', nil(3)), { address: '/foo/ba', args: [] }],
  [buf('/foo/bar', nil(4), ',', nil(3)), { address: '/foo/bar', args: [] }],
  [buf('/test', nil(3), ',i', nil(2), int32(0x01020304)), { address: '/test', args: [ { type: 'i', value: 0x01020304 } ] }],
];
