import type { JSONObject } from '../json';

export function stringify(data: JSONObject): string {
  return Object.keys(data)
    .map((key) => {
      let value = data[key];

      if (value === null || value === undefined) {
        return `${key}=`;
      }

      if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else {
        value = value.toString();
      }

      const needsQuoting = value.includes(' ') || value.includes('=');
      const needsEscaping = value.includes('"') || value.includes('\\');

      if (needsEscaping) value = value.replace(/["\\]/g, '\\$&');
      if (needsQuoting || needsEscaping) value = `"${value}"`;

      return `${key}=${value}`;
    })
    .join(' ');
}
