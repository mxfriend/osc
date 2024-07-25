import type { BufferInterface } from '../buffer';
import type { OSCColorValue, OSCMIDIValue } from './values';

export type OSCTypeMap = {
  i: number;
  f: number;
  s: string;
  b: BufferInterface;
  h: bigint;
  t: bigint;
  d: number;
  S: string;
  c: string;
  r: OSCColorValue;
  m: OSCMIDIValue;
  B: boolean;
  N: null;
  I: number;
};

export type OSCType = string & keyof OSCTypeMap;
export type OSCValue<T extends OSCType> = OSCTypeMap[T];

export type OSCArgs = {
  readonly types: string;
  readonly values: unknown[];
};

export type OSCMessage = OSCArgs & {
  readonly address: string;
};

export type OSCBundle = {
  readonly elements: OSCBundleElement[];
  readonly timetag: bigint;
};

export type OSCBundleElement = OSCMessage | OSCBundle;

export function isMessage(value: OSCBundleElement): value is OSCMessage {
  return value && Object.hasOwn(value, 'address');
}

export function isBundle(value: OSCBundleElement): value is OSCBundle {
  return value && Object.hasOwn(value, 'elements');
}
