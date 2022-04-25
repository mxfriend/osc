import { OSCMessage } from '../../src';
import { buf, nil } from '../test-helpers';

export const messages: [Buffer, OSCMessage][] = [
  [
    buf(
      '/test04', 0,
      ',ScTFNI', 0,
      'custom symbol', nil(3),
      nil(3), '$'
    ), {
      address: '/test04',
      args: [
        { type: 'S', value: 'custom symbol' },
        { type: 'c', value: '$' },
        { type: 'B', value: true },
        { type: 'B', value: false },
        { type: 'N', value: null },
        { type: 'I', value: Infinity },
      ],
    },
  ],
];
