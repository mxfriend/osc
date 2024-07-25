import { getNextToken } from '../../typeTag';

function specToPattern(spec: string, fullSpec: string = spec, offset: number = 0): string {
  const pattern: string[] = [];
  const optionals: string[] = [];
  let s = 0;

  while (s < spec.length) {
    const [token, rest, optional, n] = getNextToken(spec, s, fullSpec, offset);

    if (optional && !rest) {
      pattern.push('(?:');
      optionals.push(')?');
    }

    switch (token.charAt(0)) {
      case '(':
        pattern.push(`[${token.slice(1, -1)}]`);
        break;
      case '{':
      case '[':
      case '<':
        rest && pattern.push('(?:');
        pattern.push(`\\[${specToPattern(token.slice(1, -1), fullSpec, offset + s + 1)}\\]`);
        rest && pattern.push(')');
        break;
      case '.':
        pattern.push(rest ? '.' : '[a-z]|\\[.*?\\]');
        break;
      default:
        pattern.push(token);
        break;
    }

    if (rest) {
      pattern.push('*?');
    }

    s += n;
  }

  return `${pattern.join('')}${optionals.join('')}`;
}

export function createTypeSpecPattern(spec: string): RegExp {
  return new RegExp(`^${specToPattern(spec)}$`, 'i');
}
