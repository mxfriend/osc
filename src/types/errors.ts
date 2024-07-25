export class TypeSpecifierError extends TypeError {
  constructor(specifier: string, message: string, offset?: number) {
    const loc = offset === undefined ? '' : ` at offset ${offset}`;
    super(`Invalid type specifier '${specifier}': ${message}${loc}`);
  }
}

export class InvalidArgumentError extends TypeError {
  constructor(value: unknown, expected?: string, offset?: number, path?: string) {
    const loc = offset === undefined ? '' : ` at offset ${offset}`;
    const no = path === undefined ? '' : ` #${path}`;
    const msg =
      expected === undefined
        ? `Extraneous value${no}`
        : value === undefined
          ? `Missing value${no}`
          : value === null
            ? `Invalid 'null' value${no}`
            : typeof value === 'object'
              ? `Invalid value${no} of type '${value.constructor.name}'`
              : `Invalid value${no} of type '${typeof value}'`;
    const exp = expected === undefined ? '' : `, expected ${expected}${loc}`;

    super(`${msg}${exp}`);
  }
}
