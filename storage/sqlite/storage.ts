import type { Kysely } from 'kysely';
import { error, success, type Result } from '../../result';
import type { Folder, StorageBackend } from '../types';
import type { DB } from './types';

export class SqliteStorage implements StorageBackend {
  private readonly database: Kysely<DB>;

  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  async getFile(key: string): Promise<Result<ReadableStream, 'file_not_found'>> {
    const row = await this.database
      .selectFrom('storage_blob')
      .selectAll()
      .where('storage_blob.id', '=', key)
      .executeTakeFirst();

    if (!row) {
      return error('file_not_found');
    }

    const blob = new Blob([row.data]);

    return success(blob.stream());
  }

  async createFile(source: ReadableStream, _folder?: Folder, _type?: string): Promise<string> {
    const key = crypto.randomUUID();

    const data = Buffer.from(await Bun.readableStreamToArrayBuffer(source));

    await this.database
      .insertInto('storage_blob')
      .values({
        id: key,
        created_at: Date.now(),
        data: data,
      })
      .execute();

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    await this.database.deleteFrom('storage_blob').where('storage_blob.id', '=', key).execute();
  }
}
