import { OSCColorValue, OSCMIDIValue } from './values';

export type OSCInt = {
  type: 'i';
  value: number;
};

export type OSCFloat = {
  type: 'f';
  value: number;
};

export type OSCString = {
  type: 's';
  value: string;
};

export type OSCBlob = {
  type: 'b';
  value: Uint8Array;
};

export type OSCBigInt = {
  type: 'h';
  value: bigint;
};

export type OSCTimeTag = {
  type: 't';
  value: bigint;
};

export type OSCDouble = {
  type: 'd';
  value: number;
};

export type OSCSymbol = {
  type: 'S';
  value: string;
};

export type OSCChar = {
  type: 'c';
  value: string;
};

export type OSCColor = {
  type: 'r';
  value: OSCColorValue;
};

export type OSCMIDI = {
  type: 'm';
  value: OSCMIDIValue;
};

export type OSCBool = {
  type: 'B';
  value: boolean;
};

export type OSCNull = {
  type: 'N';
  value: null;
};

export type OSCInfinity = {
  type: 'I';
  value: number;
};

export type OSCArray = {
  type: 'a';
  value: OSCArgument[];
};

export type OSCType = 'i' | 'f' | 's' | 'b' | 'h' | 't' | 'd' | 'S' | 'c' | 'r' | 'm' | 'B' | 'N' | 'I' | 'a';
export type OSCArgument =
  | OSCInt
  | OSCFloat
  | OSCString
  | OSCBlob
  | OSCBigInt
  | OSCTimeTag
  | OSCDouble
  | OSCSymbol
  | OSCChar
  | OSCColor
  | OSCMIDI
  | OSCBool
  | OSCNull
  | OSCInfinity
  | OSCArray;

export type OSCMessage = {
  address: string;
  args: OSCArgument[];
};

export type OSCBundle = {
  elements: OSCBundleElement[];
  timetag: bigint;
};

export type OSCBundleElement = OSCMessage | OSCBundle;

export function isMessage(value: OSCBundleElement): value is OSCMessage {
  return value && typeof (value as any).address === 'string';
}

export function isBundle(value: OSCBundleElement): value is OSCBundle {
  return value && Array.isArray((value as any).elements);
}

export type OSCArgumentOfType<T extends OSCType> =
  | (T extends 'i' ? OSCInt : never)
  | (T extends 'f' ? OSCFloat : never)
  | (T extends 's' ? OSCString : never)
  | (T extends 'b' ? OSCBlob : never)
  | (T extends 'h' ? OSCBigInt : never)
  | (T extends 't' ? OSCTimeTag : never)
  | (T extends 'd' ? OSCDouble : never)
  | (T extends 'S' ? OSCSymbol : never)
  | (T extends 'c' ? OSCChar : never)
  | (T extends 'r' ? OSCColor : never)
  | (T extends 'm' ? OSCMIDI : never)
  | (T extends 'B' ? OSCBool : never)
  | (T extends 'N' ? OSCNull : never)
  | (T extends 'I' ? OSCInfinity : never)
  | (T extends 'a' ? OSCArray : never);


export function isOSCType<T extends OSCType>(arg: OSCArgument, type: T): arg is OSCArgumentOfType<T> {
  return arg && arg.type === type;
}

export function isSingleOSCType<T extends OSCType>(args: OSCArgument[], type: T): args is OSCArgumentOfType<T>[] {
  return args.every((arg) => isOSCType(arg, type));
}

export function isAnyOSCType<T extends OSCType>(arg: OSCArgument, ...types: T[]): arg is OSCArgumentOfType<T> {
  return arg && types.includes(arg.type as any);
}


export function assertOSCType<T extends OSCType>(arg: OSCArgument, type: T): asserts arg is OSCArgumentOfType<T> {
  if (!isOSCType(arg, type)) {
    throw new TypeError(`Unexpected OSC value type "${arg.type}", expected "${type}"`);
  }
}

export function assertAnyOSCType<T extends OSCType>(arg: OSCArgument, ...types: T[]): asserts arg is OSCArgumentOfType<T> {
  if (!isAnyOSCType(arg, ...types)) {
    const expected = types.length > 1 ? `${types.slice(0, -1).join(`", "`)}" or "${types.slice(-1)}` : types[0];
    throw new TypeError(`Unexpected OSC value type "${arg.type}", expected "${expected}"`);
  }
}

const factories = {
  int: (value: number): OSCInt => ({ type: 'i', value }),
  float: (value: number): OSCFloat => ({ type: 'f', value }),
  string: (value: string): OSCString => ({ type: 's', value }),
  blob: (value: Uint8Array): OSCBlob => ({ type: 'b', value }),
  bigint: (value: bigint): OSCBigInt => ({ type: 'h', value }),
  timetag: (value: bigint): OSCTimeTag => ({ type: 't', value }),
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
};

function toOptional<T, A extends any[]>(fn: (value: T, ...args: A) => OSCArgument): (value?: T | undefined, ...args: A) => OSCArgument | undefined {
  return (value, ...args) => value === undefined ? undefined : fn(value, ...args);
}

function toNullable<T, A extends any[]>(fn: (value: T, ...args: A) => OSCArgument): (value?: T | undefined, ...args: A) => OSCArgument {
  return (value, ...args) => value === undefined ? { type: 'N', value: null } : fn(value, ...args);
}
