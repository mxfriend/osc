import type { OSCMessage } from '../../src';
import { buf, nil } from '../lib/helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf('/test04', 0, ',ScTFNI', 0, 'custom symbol', nil(3), nil(3), '$'),
    {
      address: '/test04',
      types: 'ScBBNI',
      values: ['custom symbol', '$', true, false, null, Infinity],
    },
  ],
];
