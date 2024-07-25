import { TypeMatcherFactory } from './factory';

export * from './factory';
export * from './matchers';
export * from './types';

export const defaultTypeMatchers = new TypeMatcherFactory();
