import { getErrorMessage } from '../error';
import { type Result, error, success } from '../result';
import type { Primitive } from '../types';

/**
 * Substitues variable in a template string with values from a context map.
 * Variables in the template are denoted by ${variableName}.
 */
export function substitute(template: string, context: Record<string, Primitive>): Result<string, 'missing_variable'> {
  try {
    const result = template.replace(/\$\{(\w+)\}/g, (_, key) => {
      if (context[key] === undefined || context[key] === null) {
        throw new Error(key);
      }

      return context[key].toString();
    });

    return success(result);
  } catch (e) {
    return error('missing_variable', getErrorMessage(e));
  }
}
