import { TypeSpecifierError } from '../types';

export function getNextToken(
  spec: string,
  start: number,
  fullSpec: string = spec,
  offset: number = 0,
): [type: string, rest: boolean, optional: boolean, n: number] {
  const type = resolveNextType(spec, start, fullSpec, offset);
  let n = type.length;
  const rest = spec.charAt(start + n) === '*';
  rest && ++n;
  const optional = spec.charAt(start + n) === '?';
  optional && ++n;
  return [type, rest, optional, n];
}

function resolveNextType(spec: string, start: number, fullSpec: string, offset: number): string {
  const parentheses: string[] = [];

  if (spec.charAt(start) === '(') {
    const end = spec.indexOf(')', start);

    if (end < 0) {
      throw new TypeSpecifierError(fullSpec, `unmatched '('`, offset + start);
    }

    return spec.slice(start, end + 1);
  }

  for (let i = start; i < spec.length; ++i) {
    const char = spec.charAt(i);

    switch (char) {
      case '[':
        parentheses.push(']');
        break;
      case '{':
        parentheses.push('}');
        break;
      case '<':
        parentheses.push('>');
        break;
      case ']':
      case '}':
      case '>': {
        const expected = parentheses.pop();

        if (!expected || char !== expected) {
          const hint = expected ? `, expected '${expected}'` : '';
          throw new TypeSpecifierError(fullSpec, `unexpected '${char}'${hint}`, offset + start + i);
        }
        break;
      }
    }

    if (!parentheses.length) {
      return spec.slice(start, i + 1);
    }
  }

  throw new TypeSpecifierError(fullSpec, `unmatched '${parentheses[0]}'`, offset + start);
}
