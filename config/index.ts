import type { ZodSchema } from 'zod';
import { readFileSync } from 'node:fs';

export function setupConfig<E extends { CONFIG_FILEPATH: string }, F>(
  envSchema: ZodSchema<E>,
  fileSchema: ZodSchema<F>,
): { env: E; config: F };
export function setupConfig<E, F>(envSchema: ZodSchema<E>, fileSchema: ZodSchema<F>): { env: E };
export function setupConfig<E extends { CONFIG_FILEPATH?: string }, F>(
  envSchema: ZodSchema<E>,
  fileSchema: ZodSchema<F>,
): { env: E; config?: F } {
  const env = envSchema.parse(process.env);

  if (!env.CONFIG_FILEPATH) {
    return {
      env,
    };
  }

  const content = readFileSync(env.CONFIG_FILEPATH, 'utf-8');
  const config = fileSchema.parse(JSON.parse(content));

  return {
    env,
    config,
  };
}
