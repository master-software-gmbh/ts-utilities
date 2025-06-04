import { type InferOutput, object, optional, partial, picklist, string } from 'valibot';

const format = picklist(['mp3']);

export const AudioTransformationOptions = partial(
  object({
    overlay_path: string(),
    format: optional(format, 'mp3'),
  }),
);

export type AudioTransformationOptions = InferOutput<typeof AudioTransformationOptions>;
