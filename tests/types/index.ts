import { OSCMessage } from '../../src';
import { messages as m01 } from './basic';
import { messages as m02 } from './64bit';
import { messages as m03 } from './colorAndMidi';
import { messages as m04 } from './others';
import { messages as m05 } from './arrays';

export const messages: [Buffer, OSCMessage][] = [
  ...m01,
  ...m02,
  ...m03,
  ...m04,
  ...m05,
];
