import { type GenericSchema, array, fallback, optional, pipe, string, transform, union } from 'valibot';

export function omitEmptyFile() {
  return transform<File, File | undefined>((file) => (file.size > 0 ? file : undefined));
}

export function omitEmptyString() {
  return transform<string, string | undefined>((value) => (value.length === 0 ? undefined : value));
}

export function htmlCheckbox() {
  return pipe(
    optional(string(), 'off'),
    transform<string, boolean>((value) => value === 'on'),
  );
}

export function booleanString(defaultValue?: boolean) {
  if (defaultValue === undefined) {
    return pipe(
      string(),
      transform<string, boolean>((value) => value === 'true'),
    );
  }

  return fallback(
    pipe(
      string(),
      transform<string, boolean>((value) => value === 'true'),
    ),
    defaultValue,
  );
}

export function maybeArray<T>(schema: GenericSchema<T>) {
  return union([
    array(schema),
    pipe(
      schema,
      transform((input) => [input]),
    ),
  ]);
}
