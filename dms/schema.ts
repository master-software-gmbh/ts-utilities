import { description, enum_, number, object, pipe, string, uuid, type InferOutput } from 'valibot';

export const DocumentStatus = {
  draft: 'draft',
  published: 'published',
  archived: 'archived',
} as const;

/**
 * A document is the core entity in a document management system.
 * Documents are containers for revisions. They can't be modified
 * or permanently deleted, only new revisions can be added.
 *
 * The current version of a document is the latest revision.
 */
export const Document = object({
  id: pipe(string(), uuid()),
  status: enum_(DocumentStatus),
});

/**
 * A revision is a version of a document. Documents support
 * different types of content such as text, images, pdfs, etc.
 * All content is stored as a file.
 */
export const Revision = object({
  id: pipe(string(), uuid()),
  title: string(),
  fileId: string(),
  creatorId: string(),
  documentId: pipe(string(), uuid()),
  createdAt: pipe(number(), description('UNIX timestamp')),
});

export type DocumentStatus = keyof typeof DocumentStatus;
export type Document = InferOutput<typeof Document>;
export type Revision = InferOutput<typeof Revision>;
