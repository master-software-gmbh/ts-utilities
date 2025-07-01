import { getErrorMessage } from '../error';
import { error, success, type Result } from '../result';

/**
 * Substitues variable in a template string with values from a context map.
 * Variables in the template are denoted by ${variableName}.
 */
export function substitute(template: string, context: Record<string, string>): Result<string, 'missing_variable'> {
  try {
    const result = template.replace(/\$\{(\w+)\}/g, (_, key) => {
      if (context[key] === undefined) {
        throw new Error(key);
      }

      return context[key];
    });

    return success(result);
  } catch (e) {
    return error('missing_variable', getErrorMessage(e));
  }
}
