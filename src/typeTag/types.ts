export interface TypeResolver<V = any> {
  getTypeName(): string;
  isValidValue(value: unknown): value is V;
  getTypeTag(value: V): string;
}
