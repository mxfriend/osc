import { BufferInterface } from './buffer';
import {
  isOSCType,
  OSCArgument,
  OSCArgumentOfType,
  OSCArray,
  OSCBigInt,
  OSCBlob,
  OSCBool,
  OSCBundle,
  OSCBundleElement,
  OSCChar,
  OSCColor,
  OSCDouble,
  OSCFloat,
  OSCInfinity,
  OSCInt,
  OSCMessage,
  OSCMIDI,
  OSCNull,
  OSCString,
  OSCSymbol,
  OSCTimeTag,
  OSCType,
} from './types';
import { OSCColorValue, OSCMIDIValue } from './values';

function toNTPTime(value: Date | string | number): bigint {
  const ts = typeof value === 'object' ? value.getTime() : typeof value === 'string' ? Date.parse(value) : value;
  const seconds = BigInt(Math.trunc(ts / 1000));
  const ms = BigInt(ts % 1000) + 1n;
  return ((seconds + 2208988800n) << 32n) | (ms * (1n << 32n) / 1000n);
}

function fromNTPTime(t: bigint): Date {
  const seconds = ((t >> 32n) & 0xffffffffn) - 2208988800n;
  const frac = ((t & 0xffffffffn) * 1000n) / (1n << 32n);
  return new Date(Number(seconds) * 1000 + Number(frac));
}

export type OSCRestType = `...${OSCType}`;
export type OSCOptionalType = `${OSCType}?`;
export type OSCTypeSpec = OSCType | OSCOptionalType | OSCRestType;

export type OSCArg<T extends OSCTypeSpec> =
  T extends `...${infer P extends OSCType}` ? OSCArgumentOfType<P>[]
    : T extends `${infer P extends OSCType}?` ? OSCArgumentOfType<P> | undefined
      : T extends OSCType ? OSCArgumentOfType<T>
        : never;

export type OSCArgs<Types extends [...OSCTypeSpec[]]> =
  | { [T in keyof Types]: OSCArg<Types[T]> }
  | { [T in keyof Types]: undefined };

export type OSCValue<T extends OSCTypeSpec> =
  T extends `...${infer P extends OSCType}` ? OSCArgumentOfType<P>['value'][]
    : T extends `${infer P extends OSCType}?` ? OSCArgumentOfType<P>['value'] | undefined
      : T extends OSCType ? OSCArgumentOfType<T>['value']
        : never;

export type OSCValues<Types extends [...OSCTypeSpec[]]> =
  | { [T in keyof Types]: OSCValue<Types[T]> }
  | { [T in keyof Types]: undefined };


function validateArgs<T extends [...OSCTypeSpec[]]>(args?: OSCArgument[], ...types: T): OSCArgs<T> {
  if (!args) {
    return [] as OSCArgs<T>;
  }

  const extracted: any[] = [];
  let i = 0;

  for (const spec of types) {
    const [, rest, type, optional] = spec.match(/^(\.\.\.)?(.)(\?)?$/)!;

    if (rest) {
      const arr: any[] = [];

      while (isOSCType(args[i], type as OSCType)) {
        arr.push(args[i]);
        ++i;
      }

      extracted.push(arr);
    } else {
      if (isOSCType(args[i], type as OSCType)) {
        extracted.push(args[i]);
        ++i;
      } else if (optional) {
        extracted.push(undefined);

        if (isOSCType(args[i], 'N')) {
          ++i;
        }
      } else {
        return [] as OSCArgs<T>;
      }
    }
  }

  return extracted as OSCArgs<T>;
}

function extractArgs<T extends [...OSCTypeSpec[]]>(args?: OSCArgument[], ...types: T): OSCValues<T> {
  return validateArgs(args, ...types)
    .map((a) => Array.isArray(a) ? a.map((v) => v.value) : a?.value) as OSCValues<T>;
}

type S = OSCTypeSpec;
type V<T extends S> = OSCValue<T>;

function composeArgs<T0 extends S>(t0: T0, v0: V<T0>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S, T3 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S, T7 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>, t7: T7, v7: V<T7>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S, T7 extends S, T8 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>, t7: T7, v7: V<T7>, t8: T8, v8: V<T8>): OSCArgument[];
function composeArgs<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S, T7 extends S, T8 extends S, T9 extends S>(t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>, t7: T7, v7: V<T7>, t8: T8, v8: V<T8>, t9: T9, v9: V<T9>): OSCArgument[];
function composeArgs(...pairs: any[]): OSCArgument[] {
  const args: OSCArgument[] = [];

  for (let i = 0; i < pairs.length; i += 2) {
    const spec = pairs[i];
    const [, rest, type, optional] = spec.match(/^(\.\.\.)?(.)(\?)?$/);
    const arg = pairs[i + 1];

    if (rest) {
      arg.length && args.push(...arg.map((value: any) => ({ type, value })));
    } else if (arg === undefined) {
      if (!optional) {
        throw new Error(`Missing value for argument pair #${i / 2}`);
      }
    } else {
      args.push({ type, value: arg });
    }
  }

  return args;
}

function composeMessage<T0 extends S>(address: string, t0: T0, v0: V<T0>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S, T3 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S, T7 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>, t7: T7, v7: V<T7>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S, T7 extends S, T8 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>, t7: T7, v7: V<T7>, t8: T8, v8: V<T8>): OSCMessage;
function composeMessage<T0 extends S, T1 extends S, T2 extends S, T3 extends S, T4 extends S, T5 extends S, T6 extends S, T7 extends S, T8 extends S, T9 extends S>(address: string, t0: T0, v0: V<T0>, t1: T1, v1: V<T1>, t2: T2, v2: V<T2>, t3: T3, v3: V<T3>, t4: T4, v4: V<T4>, t5: T5, v5: V<T5>, t6: T6, v6: V<T6>, t7: T7, v7: V<T7>, t8: T8, v8: V<T8>, t9: T9, v9: V<T9>): OSCMessage;
function composeMessage(address: string, ...pairs: any[]): OSCMessage {
  return { address, args: composeArgs(...pairs as Parameters<typeof composeArgs>) };
}

function composeBundle(...elements: OSCBundleElement[]): OSCBundle;
function composeBundle(timetag: Date | string | number | bigint, ...elements: OSCBundleElement[]): OSCBundle;
function composeBundle(a0: Date | string | number | bigint | OSCBundleElement, ...elems: OSCBundleElement[]): OSCBundle {
  const [timetag, elements] = typeof a0 === 'bigint' ? [a0, elems]
    : typeof a0 === 'object' && !(a0 instanceof Date) ? [toNTPTime(Date.now()), [a0, ...elems]]
    : [toNTPTime(a0), elems];
  return { elements, timetag };
}

const factories = {
  int: (value: number): OSCInt => ({ type: 'i', value }),
  float: (value: number): OSCFloat => ({ type: 'f', value }),
  string: (value: string): OSCString => ({ type: 's', value }),
  blob: (value: BufferInterface): OSCBlob => ({ type: 'b', value }),
  bigint: (value: bigint): OSCBigInt => ({ type: 'h', value }),
  timetag: (value: Date | string | number | bigint): OSCTimeTag => ({
    type: 't',
    value: typeof value === 'bigint' ? value : toNTPTime(value),
  }),
  double: (value: number): OSCDouble => ({ type: 'd', value }),
  symbol: (value: string): OSCSymbol => ({ type: 'S', value }),
  char: (value: string): OSCChar => ({ type: 'c', value }),
  color: (value: OSCColorValue | number, g?: number, b?: number, a?: number): OSCColor => {
    if (typeof value === 'number') {
      value = new OSCColorValue(value, g!, b, a);
    }

    return { type: 'r', value };
  },
  midi: (value: OSCMIDIValue | number, status?: number, data1?: number, data2?: number): OSCMIDI => {
    if (typeof value === 'number') {
      value = new OSCMIDIValue(value, status!, data1, data2);
    }

    return { type: 'm', value };
  },
  bool: (value: boolean): OSCBool => ({ type: 'B', value }),
  null: (): OSCNull => ({ type: 'N', value: null }),
  infinity: (): OSCInfinity => ({ type: 'I', value: Infinity }),
  array: (...value: OSCArgument[]): OSCArray => ({ type: 'a', value }),
};



export const osc = {
  message: composeMessage,
  bundle: composeBundle,
  compose: composeArgs,
  validate: validateArgs,
  extract: extractArgs,
  timetagToDate: (arg: OSCTimeTag | bigint) => fromNTPTime(typeof arg === 'object' ? arg.value : arg),
  ...factories,
  optional: {
    int: toOptional(factories.int),
    float: toOptional(factories.float),
    string: toOptional(factories.string),
    blob: toOptional(factories.blob),
    bigint: toOptional(factories.bigint),
    timetag: toOptional(factories.timetag),
    double: toOptional(factories.double),
    symbol: toOptional(factories.symbol),
    char: toOptional(factories.char),
    color: toOptional(factories.color),
    midi: toOptional(factories.midi),
    bool: toOptional(factories.bool),
    null: toOptional(factories.null),
    infinity: toOptional(factories.infinity),
    array: toOptional(factories.array),
  },
  nullable: {
    int: toNullable(factories.int),
    float: toNullable(factories.float),
    string: toNullable(factories.string),
    blob: toNullable(factories.blob),
    bigint: toNullable(factories.bigint),
    timetag: toNullable(factories.timetag),
    double: toNullable(factories.double),
    symbol: toNullable(factories.symbol),
    char: toNullable(factories.char),
    color: toNullable(factories.color),
    midi: toNullable(factories.midi),
    bool: toNullable(factories.bool),
    infinity: toNullable(factories.infinity),
    array: toNullable(factories.array),
  },
  is: {
    int: getTypeGuard('i'),
    float: getTypeGuard('f'),
    string: getTypeGuard('s'),
    blob: getTypeGuard('b'),
    bigint: getTypeGuard('h'),
    timetag: getTypeGuard('t'),
    double: getTypeGuard('d'),
    symbol: getTypeGuard('S'),
    char: getTypeGuard('c'),
    color: getTypeGuard('r'),
    midi: getTypeGuard('m'),
    bool: getTypeGuard('B'),
    infinity: getTypeGuard('I'),
    null: getTypeGuard('N'),
    array: getTypeGuard('a'),
  },
};

function toOptional<T, A extends any[]>(fn: (value: T, ...args: A) => OSCArgument): (value?: T | undefined, ...args: A) => OSCArgument | undefined {
  return (value, ...args) => value === undefined ? undefined : fn(value, ...args);
}

function toNullable<T, A extends any[]>(fn: (value: T, ...args: A) => OSCArgument): (value?: T | undefined, ...args: A) => OSCArgument {
  return (value, ...args) => value === undefined ? { type: 'N', value: null } : fn(value, ...args);
}

function getTypeGuard<T extends OSCType>(type: T): (arg: OSCArgument) => arg is OSCArgumentOfType<T> {
  return (arg): arg is OSCArgumentOfType<T> => isOSCType(arg, type);
}
