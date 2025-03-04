export interface CmsBlock {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  content: unknown;
  documentId: string;
}
