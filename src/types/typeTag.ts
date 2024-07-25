import type { OSCType, OSCValue } from './basic';

type TypeSpecifier = OSCType | '.';

type ConcreteTypeList<T, P extends OSCType = OSCType> = T extends P
  ? T
  : T extends `${infer T1 extends P}${infer Rest}`
    ? `${T1}${ConcreteTypeList<Rest, Exclude<P, T1>>}`
    : never;

type MaybeCardinality<S extends string, O extends boolean = false> = S extends '*'
  ? S
  : S extends `?${infer R}`
    ? `?${OSCTypeTag<R, true>}`
    : O extends false
      ? OSCTypeTag<S>
      : never;

type AltSpec<S extends string> = `(${S})`;
type TupleSpec<S extends string> = `{${S}}` | `[${S}]` | `<${S}>`;

export type OSCTypeTag<
  S extends string,
  O extends boolean = false,
> = S extends `${AltSpec<infer I>}${infer R}`
  ? `${AltSpec<ConcreteTypeList<I>>}${MaybeCardinality<R, O>}`
  : S extends `${TupleSpec<infer I>}${infer R}`
    ? `${TupleSpec<OSCTypeTag<I>>}${MaybeCardinality<R, O>}`
    : S extends `${infer T extends TypeSpecifier}${infer R}`
      ? `${T}${MaybeCardinality<R, O>}`
      : '';

type Value<T extends TypeSpecifier> = T extends OSCType ? OSCValue<T> : unknown;

type AnyValue<T extends string> = T extends `${infer T0 extends TypeSpecifier}${infer R}`
  ? Value<T0> | AnyValue<R>
  : never;

type ApplyCardinality<T, S extends string> = S extends '*'
  ? [...T[]]
  : S extends `?${infer R}`
    ? [T?, ...OSCValues<R>]
    : [T, ...OSCValues<S>];

export type OSCValues<S extends string> = S extends `${AltSpec<infer I>}${infer R}`
  ? ApplyCardinality<AnyValue<I>, R>
  : S extends `${TupleSpec<infer I>}${infer R}`
    ? ApplyCardinality<OSCValues<I>, R>
    : S extends `${infer T extends TypeSpecifier}${infer R}`
      ? ApplyCardinality<Value<T>, R>
      : [];

export type TypedOSCArgs<S extends string> = {
  types: S extends OSCTypeTag<S> ? S : never;
  values: OSCValues<S>;
};

export type TypedOSCMessage<S extends string> = TypedOSCArgs<S> & {
  address: string;
};
