import { z } from 'zod';

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
export const Document = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(DocumentStatus),
});

/**
 * A revision is a version of a document. Documents support
 * different types of content such as text, images, pdfs, etc.
 * All content is stored as a file.
 */
export const Revision = z.object({
  id: z.string().uuid(),
  title: z.string(),
  fileId: z.string(),
  creatorId: z.string(),
  documentId: z.string().uuid(),
  createdAt: z.number().describe('UNIX timestamp'),
});

export type DocumentStatus = keyof typeof DocumentStatus;
export type Document = z.infer<typeof Document>;
export type Revision = z.infer<typeof Revision>;
