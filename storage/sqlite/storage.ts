import type { Kysely } from 'kysely';
import { type Result, error, success } from '../../result';
import { FileContent, Folder } from '../types';
import type { DB } from './types';
import type { StorageBackend } from '../interface';
import { BaseStorageBackend } from '../base';

export class SqliteStorage extends BaseStorageBackend implements StorageBackend {
  private readonly database: Kysely<DB>;

  constructor(database: Kysely<DB>) {
    super(new Folder());
    this.database = database;
  }

  fileExists(key: string): Promise<boolean> {
    const { path } = this.getId(key);

    return this.database
      .selectFrom('storage_blob')
      .select('id')
      .where('storage_blob.id', '=', path)
      .execute()
      .then((rows) => rows.length > 0);
  }

  async getFile(key: string): Promise<Result<FileContent, 'file_not_found'>> {
    const { path } = this.getId(key);

    const row = await this.database
      .selectFrom('storage_blob')
      .selectAll()
      .where('storage_blob.id', '=', path)
      .executeTakeFirst();

    if (!row) {
      return error('file_not_found');
    }

    const blob = new Blob([row.data]);

    return success(new FileContent(blob.stream()));
  }

  async createFile(source: ReadableStream): Promise<string> {
    const { key, path } = this.getId();

    const data = Buffer.from(await Bun.readableStreamToArrayBuffer(source));

    await this.database
      .insertInto('storage_blob')
      .values({
        id: path,
        created_at: Date.now(),
        data: data,
      })
      .execute();

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    const { path } = this.getId(key);
    await this.database.deleteFrom('storage_blob').where('storage_blob.id', '=', path).execute();
  }
}
