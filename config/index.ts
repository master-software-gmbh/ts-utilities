import { readFileSync } from 'node:fs';
import type { ZodSchema, ZodType, z } from 'zod';
import { logger } from '../logging';

export function setupConfig<E extends { CONFIG_FILEPATH: string }, F>(
  envSchema: ZodSchema<E>,
  fileSchema: ZodSchema<F>,
): { env: E; config: F };
export function setupConfig<E, F>(envSchema: ZodSchema<E>, fileSchema: ZodSchema<F>): { env: E };
export function setupConfig<E extends { CONFIG_FILEPATH?: string }, F>(
  envSchema: ZodSchema<E>,
  fileSchema: ZodSchema<F>,
): { env: E; config?: F } {
  let env: z.infer<ZodType<E>>;

  try {
    env = envSchema.parse(process.env);
  } catch (error) {
    logger.error('Failed to parse configuration from environment', { error: JSON.stringify(error) });
    throw error;
  }

  if (!env.CONFIG_FILEPATH) {
    return {
      env,
    };
  }

  try {
    const content = readFileSync(env.CONFIG_FILEPATH, 'utf-8');
    const config = fileSchema.parse(JSON.parse(content));

    return {
      env,
      config,
    };
  } catch (error) {
    logger.error('Failed to parse configuration from file', { error: JSON.stringify(error) });
    throw error;
  }
}
