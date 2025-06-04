import { existsSync } from 'node:fs';
import { createReadStream, createWriteStream, mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { type Result, error, success } from '../../result';
import { BaseStorageBackend } from '../base';
import type { StorageBackend } from '../interface';
import { FileContent, type Folder } from '../types';

export class FilesystemStorageBackend extends BaseStorageBackend implements StorageBackend {
  constructor(root: Folder) {
    super(root);
    mkdirSync(root.path, { recursive: true });
  }

  async fileExists(key: string): Promise<boolean> {
    const { path } = this.getId(key);
    return existsSync(path);
  }

  async getFile(key: string): Promise<Result<FileContent, 'file_not_found'>> {
    const { path } = this.getId(key);

    if (!existsSync(path)) {
      return error('file_not_found');
    }

    const stream = createReadStream(path);

    return success(new FileContent(Readable.toWeb(stream)));
  }

  async createFile(source: ReadableStream, data?: { key?: string }): Promise<string> {
    const { key, path } = this.getId(data?.key);
    const stream = createWriteStream(path);

    await pipeline(source, stream);

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    const { path } = this.getId(key);

    if (existsSync(path)) {
      await unlink(path);
    }
  }
}
