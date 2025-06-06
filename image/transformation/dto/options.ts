import { type InferOutput, maxValue, object, partial, picklist, pipe, string, transform } from 'valibot';

const format = picklist(['jpeg', 'png', 'webp', 'avif']);

export const ImageTransformationOptions = partial(
  object({
    format: format,
    overlay_text: string(),
    overlay_font: string(),
    overlay_font_path: string(),
    max_width: pipe(string(), transform(Number), maxValue(2000)),
    max_height: pipe(string(), transform(Number), maxValue(2000)),
  }),
);

export type ImageTransformationOptions = InferOutput<typeof ImageTransformationOptions>;
