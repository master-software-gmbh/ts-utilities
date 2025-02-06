import type { ZodSchema } from 'zod';
import { readFileSync } from 'node:fs';

export function setupConfig<E extends { CONFIG_FILEPATH: string }, F>(
  envSchema: ZodSchema<E>,
  fileSchema: ZodSchema<F>,
) {
  const env = envSchema.parse(process.env);
  const content = readFileSync(env.CONFIG_FILEPATH, 'utf-8');
  const config = fileSchema.parse(JSON.parse(content));

  return {
    env,
    config,
  };
}
