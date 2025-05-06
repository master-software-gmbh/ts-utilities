import { pipe, string, transform } from 'valibot';

export function omitEmptyFile() {
  return transform<File, File | undefined>((file) => (file.size > 0 ? file : undefined));
}

export function omitEmptyString() {
  return transform<string, string | undefined>((value) => (value.length === 0 ? undefined : value));
}

export function htmlCheckbox() {
  return pipe(
    string(),
    transform<string, boolean>((value) => value === 'on'),
  );
}
