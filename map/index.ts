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
