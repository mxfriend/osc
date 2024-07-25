import { defaultTypeMatchers } from './protocol';
import type { OSCArgs, OSCTypeTag, OSCValues, TypedOSCArgs, TypedOSCMessage } from './types';
import { normaliseTypeTag } from './typeTag';

export namespace osc {
  export function args<S extends string>(
    types: S extends OSCTypeTag<S> ? S : never,
    ...values: OSCValues<S>
  ): TypedOSCArgs<S> {
    return {
      types: normaliseTypeTag(types, values) as any,
      values,
    };
  }

  export function message<S extends string>(
    address: string,
    types: S extends OSCTypeTag<S> ? S : never,
    ...values: OSCValues<S>
  ): TypedOSCMessage<S> {
    return {
      address,
      types: normaliseTypeTag(types, values) as any,
      values,
    };
  }

  export function extract<S extends string>(
    src: OSCArgs,
    types: S extends OSCTypeTag<S> ? S : never,
  ): OSCValues<S> | [] {
    const matcher = defaultTypeMatchers.get(types);
    return (matcher.matches(src.types) ? src.values : []) as any;
  }
}
