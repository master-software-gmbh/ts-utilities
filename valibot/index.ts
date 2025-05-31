import { type GenericSchema, array, optional, picklist, pipe, string, transform, union } from 'valibot';

export function omitEmptyFile() {
  return transform<File, File | undefined>((file) => (file.size > 0 ? file : undefined));
}

type Input = string | string[];
type Output<I> = I extends string ? string | undefined : I extends string[] ? string[] : never;

export function omitEmptyString<T extends Input>() {
  return transform<T, Output<T>>((value) => {
    if (Array.isArray(value)) {
      return value.filter((item) => item.length > 0) as Output<T>;
    }

    return (value.length === 0 ? undefined : (value as string | undefined)) as Output<T>;
  });
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

export function maybeArray<T>(schema: GenericSchema<T>) {
  return union([
    array(schema),
    pipe(
      schema,
      transform((input) => [input]),
    ),
  ]);
}
