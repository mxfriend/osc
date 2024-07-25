import { InvalidArgumentError, OSCColorValue, OSCMIDIValue, TypeSpecifierError } from '../types';
import {
  BigIntResolver,
  BlobResolver,
  BooleanResolver,
  CharResolver,
  DoubleResolver,
  FloatResolver,
  InfinityResolver,
  IntResolver,
  NullResolver,
  StringResolver,
  ValueResolver,
} from './resolvers';
import type { TypeResolver } from './types';
import { getNextToken } from './utils';

const resolverMap: Record<string, TypeResolver> = {
  i: new IntResolver(),
  f: new FloatResolver(),
  s: new StringResolver('s', 'string'),
  b: new BlobResolver(),
  h: new BigIntResolver('h', 'bigint'),
  t: new BigIntResolver('t', 'timetag'),
  d: new DoubleResolver(),
  S: new StringResolver('S', 'symbol'),
  c: new CharResolver(),
  r: new ValueResolver(OSCColorValue, 'r'),
  m: new ValueResolver(OSCMIDIValue, 'm'),
  B: new BooleanResolver(),
  N: new NullResolver(),
  I: new InfinityResolver(),
};

const anyResolvers = [
  resolverMap.i,
  resolverMap.f,
  resolverMap.s,
  resolverMap.b,
  resolverMap.h,
  resolverMap.r,
  resolverMap.m,
  resolverMap.B,
  resolverMap.N,
];

export function normaliseTypeTag(
  spec: string,
  values: unknown[],
  fullSpec: string = spec,
  offset: number = 0,
  prefix: string = '',
): string {
  const typeTag: string[] = [];
  let s = 0;
  let v = 0;

  while (s < spec.length) {
    const [type, rest, optional, n] = getNextToken(spec, s, fullSpec, offset);

    if (values[v] === undefined && (optional || rest)) {
      return typeTag.join('');
    }

    do {
      if (/^[{[<]/.test(type)) {
        if (!Array.isArray(values[v])) {
          throw invalidArgument(type);
        }

        typeTag.push(
          '[',
          normaliseTypeTag(
            type.slice(1, -1),
            values[v] as unknown[],
            fullSpec,
            offset + s + 1,
            `${prefix}${v}.`,
          ),
          ']',
        );
      } else {
        typeTag.push(resolveValueType(type.charAt(0) === '(' ? type.slice(1, -1) : type));
      }

      ++v;
    } while (rest && values[v] !== undefined);

    s += n;
  }

  return typeTag.join('');

  function resolveValueType(types: string): string {
    const resolvers =
      types === '.' ? anyResolvers : types.split('').map((t, i) => getResolver(t, i));

    for (const resolver of resolvers) {
      if (resolver.isValidValue(values[v])) {
        return resolver.getTypeTag(values[v]);
      }
    }

    const expected = resolvers.reduce(
      (s, r, i) =>
        `${s}${{ [resolvers.length - 1]: ' or ', '0': '' }[i] ?? ', '}'${r.getTypeName()}'`,
      '',
    );

    throw invalidArgument(expected);
  }

  function getResolver(type: string, o?: number): TypeResolver {
    if (resolverMap[type]) {
      return resolverMap[type];
    }

    throw specifierError(`unknown OSC type '${type}'`, o);
  }

  function specifierError(message: string, o: number = 0): Error {
    return new TypeSpecifierError(fullSpec, message, offset + s + o);
  }

  function invalidArgument(expected?: string): Error {
    return new InvalidArgumentError(values[v], expected, offset + s, `${prefix}${v}`);
  }
}
