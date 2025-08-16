import { readFileSync } from 'node:fs';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { SchemaError } from '@standard-schema/utils';

export async function validate<I, O>(schema: StandardSchemaV1<I, O>, data: unknown): Promise<O> {
  const result = await schema['~standard'].validate(data);

  if (result.issues) {
    throw new SchemaError(result.issues);
  }

  return result.value;
}

export async function getAppConfig<E extends { CONFIG_FILEPATH: string }, EO extends { CONFIG_FILEPATH: string }, F>(
  envSchema: StandardSchemaV1<E, EO>,
  fileSchema: StandardSchemaV1<F>,
): Promise<EO & F>;
export async function getAppConfig<E, EO, F>(envSchema: StandardSchemaV1<E, EO>, fileSchema?: never): Promise<EO>;
export async function getAppConfig<E extends { CONFIG_FILEPATH?: string }, EO extends { CONFIG_FILEPATH?: string }, F>(
  envSchema: StandardSchemaV1<E, EO>,
  fileSchema?: StandardSchemaV1<F>,
): Promise<(EO & F) | EO> {
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
