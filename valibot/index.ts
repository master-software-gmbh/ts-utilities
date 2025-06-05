import {
  type GenericPipeItem,
  type GenericPipeItemAsync,
  type GenericSchema,
  array,
  checkAsync,
  file,
  maxSize,
  nonEmpty,
  optional,
  picklist,
  pipe,
  pipeAsync,
  string,
  transform,
  trim,
  union,
} from 'valibot';
import { loadModule } from '../esm';
import { logger } from '../logging';
import type { File } from 'node:buffer';

type FInput = File | File[];
type FOutput<I> = I extends File ? File | undefined : I extends File[] ? File[] : never;

export function omitEmptyFile<T extends FInput>() {
  return transform<T, FOutput<T>>((value) => {
    if (Array.isArray(value)) {
      return value.filter((item) => item.size > 0) as FOutput<T>;
    }

    return (value.size === 0 ? undefined : value) as FOutput<T>;
  });
}

type SInput = string | string[];
type SOutput<I> = I extends string ? string | undefined : I extends string[] ? string[] : never;

export function omitEmptyString<T extends SInput>() {
  return transform<T, SOutput<T>>((value) => {
    if (Array.isArray(value)) {
      return value.filter((item) => item.length > 0) as SOutput<T>;
    }

    return (value.length === 0 ? undefined : value) as SOutput<T>;
  });
}

export function nonEmptyString() {
  return pipe(string(), trim(), nonEmpty());
}

export function htmlCheckbox() {
  return pipe(
    optional(string(), 'off'),
    transform<string, boolean>((value) => value === 'on'),
  );
}

export function booleanString(fallback?: boolean) {
  if (fallback === undefined) {
    return pipe(
      string(),
      transform<string, boolean>((value) => value === 'true'),
    );
  }

  return pipe(
    optional(picklist(['true', 'false']), fallback.toString() as 'true' | 'false'),
    transform((value) => value === 'true'),
  );
}

export function maybeArray<I, O>(schema: GenericSchema<I, O>) {
  return union([
    array(schema),
    pipe(
      schema,
      transform((input) => [input]),
    ),
  ]);
}

export async function getFileAction() {
  const module = await loadModule<typeof import('file-type')>('file-type');

  if (!module.success) {
    throw new Error('Failed to load file-type module');
  }

  return (options: {
    maxSize?: number;
    types?: string[];
  }) => {
    const types = options.types;
    const actions: (GenericPipeItemAsync | GenericPipeItem)[] = [];

    if (types) {
      actions.push(
        checkAsync<File, string>(async (file) => {
          const result = await module.data.fileTypeFromBlob(file);

          if (!result) {
            logger.debug('File type detection failed', {
              name: file.name,
              type: file.type,
            });

            return false;
          }

          const isValid = types.includes(result.mime);

          if (!isValid) {
            logger.debug('File type validation failed', {
              allowed: types,
              name: file.name,
              type: file.type,
              detected: result.mime,
            });
          }

          return isValid;
        }, 'Invalid file type'),
      );
    }

    if (options.maxSize) {
      actions.push(maxSize(options.maxSize));
    }

    return pipeAsync(file(), ...actions);
  };
}
