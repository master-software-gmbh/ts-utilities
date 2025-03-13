import { logger } from '../logging';
import { error, success, type Result } from '../result';

/**
 * Function to dynamically load a module
 * @param name module name
 * @returns loaded module
 * @throws {@link Error} module failed to load
 */
export async function loadModule<T>(name: string): Promise<Result<T, 'module_not_loaded'>> {
  try {
    const module = await import(name);

    if ('default' in module) {
      return success(module.default);
    }

    return success(module);
  } catch (e) {
    logger.error('Failed to dynamically load module', { name, error: e });
    return error('module_not_loaded');
  }
}
