import { maxValue, object, picklist, pipe, string, transform, undefined_, union, type InferOutput } from 'valibot';

const format = picklist(['jpeg', 'png', 'webp', 'avif']);

export const ImageTransformationOptions = union([
  object({
    format: format,
    maxHeight: undefined_(),
    maxWidth: pipe(string(), transform(Number), maxValue(2000)),
  }),
  object({
    format: format,
    maxWidth: undefined_(),
    maxHeight: pipe(string(), transform(Number), maxValue(2000)),
  }),
]);

export type ImageTransformationOptions = InferOutput<typeof ImageTransformationOptions>;
