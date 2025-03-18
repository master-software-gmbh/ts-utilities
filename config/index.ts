import { readFileSync } from 'node:fs';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { logger } from '../logging';

export async function setupConfig<E extends { CONFIG_FILEPATH: string }, F>(
  envSchema: StandardSchemaV1<E>,
  fileSchema: StandardSchemaV1<F>,
): Promise<{ env: E; config: F }>;
export async function setupConfig<E, F>(
  envSchema: StandardSchemaV1<E>,
  fileSchema: StandardSchemaV1<F>,
): Promise<{ env: E }>;
export async function setupConfig<E extends { CONFIG_FILEPATH?: string }, F>(
  envSchema: StandardSchemaV1<E>,
  fileSchema: StandardSchemaV1<F>,
): Promise<{ env: E; config?: F }> {
  let env = envSchema['~standard'].validate(process.env);
  if (env instanceof Promise) env = await env;

  if (env.issues) {
    logger.error('Failed to parse configuration from environment', { issues: env.issues });
    throw new Error(JSON.stringify(env.issues, null, 2));
  }

  if (!env.value.CONFIG_FILEPATH) {
    return {
      env: env.value,
    };
  }

  const content = readFileSync(env.value.CONFIG_FILEPATH, 'utf-8');
  let config = fileSchema['~standard'].validate(JSON.parse(content));
  if (config instanceof Promise) config = await config;

  if (config.issues) {
    logger.error('Failed to parse configuration from file', { issues: config.issues });
    throw new Error(JSON.stringify(config.issues, null, 2));
  }

  return {
    env: env.value,
    config: config.value,
  };
}
