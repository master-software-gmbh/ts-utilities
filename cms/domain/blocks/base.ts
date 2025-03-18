import { type InferOutput, date, nonEmpty, object, pipe, string } from 'valibot';

export const BaseBlockSchema = object({
  id: pipe(string(), nonEmpty()),
  type: pipe(string(), nonEmpty()),
  createdAt: pipe(date()),
  updatedAt: pipe(date()),
  documentId: pipe(string(), nonEmpty()),
});

export type BaseBlock = InferOutput<typeof BaseBlockSchema>;
