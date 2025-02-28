import type { Kysely } from 'kysely';
import { DocumentStatus } from './schema';
import type { DB } from './types';

export class DmsService {
  private readonly database: Kysely<DB>;

  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  public async createDocument(): Promise<string> {
    const { id } = await this.database
      .insertInto('dms_document')
      .values({
        status: DocumentStatus.draft,
      })
      .returning('dms_document.id')
      .executeTakeFirstOrThrow();

    return id;
  }

  public async createDocumentRevision(data: {
    documentId: string;
    creatorId: string;
    fileId: string;
    title: string;
  }): Promise<string> {
    const { id } = await this.database
      .insertInto('dms_revision')
      .values({
        creator_id: data.creatorId,
        document_id: data.documentId,
        file_id: data.fileId,
        title: data.title,
      })
      .returning('dms_revision.id')
      .executeTakeFirstOrThrow();

    return id;
  }
}
