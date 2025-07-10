import { readFileSync } from 'node:fs';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { SchemaError } from '@standard-schema/utils';

export async function validate<T>(schema: StandardSchemaV1<T>, data: unknown): Promise<T> {
  const result = await schema['~standard'].validate(data);

  if (result.issues) {
    throw new SchemaError(result.issues);
  }

  return result.value;
}

export async function getAppConfig<E extends { CONFIG_FILEPATH: string }, F>(
  envSchema: StandardSchemaV1<E>,
  fileSchema: StandardSchemaV1<F>,
): Promise<E & F>;
export async function getAppConfig<E, F>(envSchema: StandardSchemaV1<E>, fileSchema?: never): Promise<E>;
export async function getAppConfig<E extends { CONFIG_FILEPATH?: string }, F>(
  envSchema: StandardSchemaV1<E>,
  fileSchema?: StandardSchemaV1<F>,
): Promise<(E & F) | E> {
  const envConfig = await validate(envSchema, process.env);
  let fileConfig: F | undefined;

  if (envConfig.CONFIG_FILEPATH && fileSchema) {
    const content = readFileSync(envConfig.CONFIG_FILEPATH, 'utf-8');
    fileConfig = await validate(fileSchema, JSON.parse(content));
  }

  return {
    ...envConfig,
    ...fileConfig,
  };
}
