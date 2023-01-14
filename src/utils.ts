export const BUNDLE_TAG = '#bundle';

export function nonempty<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}
