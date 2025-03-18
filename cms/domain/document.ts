import { type InferOutput, date, nonEmpty, object, pipe, string } from 'valibot';

export const DocumentSchema = object({
  id: pipe(string(), nonEmpty()),
  title: pipe(string(), nonEmpty()),
  createdAt: pipe(date()),
  updatedAt: pipe(date()),
});

export type Document = InferOutput<typeof DocumentSchema>;
