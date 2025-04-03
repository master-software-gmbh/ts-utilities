/**
 * Checks that attributes in `first` have the same value in `second`.
 * Attributes with a value of `false` are considered equal to non-existing attributes.
 */
export function compareRecords(
  first: Record<string, number | string | boolean>,
  second: Record<string, number | string | boolean>,
): boolean {
  for (const [key, value] of Object.entries(first)) {
    if (typeof value === 'boolean') {
      if (!value && !(key in second)) {
        continue;
      }
    }

    if (!(key in second)) {
      return false;
    }

    if (value !== second[key]) {
      return false;
    }
  }

  return true;
}

export function mapFields<T extends Record<string, unknown[]>>(data: T): Array<{ [K in keyof T]: T[K][number] }> {
  const result: Array<{ [K in keyof T]: T[K][number] }> = [];

  for (const [key, values] of Object.entries(data)) {
    for (const [index, value] of values.entries()) {
      if (!result[index]) {
        result[index] = {} as { [K in keyof T]: T[K][number] };
      }

      result[index][key as keyof T] = value as T[keyof T][number];
    }
  }

  return result;
}
