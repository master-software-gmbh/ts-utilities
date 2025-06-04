import { mkdirSync, createReadStream, createWriteStream } from 'node:fs';
import { error, success, type Result } from '../../result';
import { FileContent, type Folder } from '../types';
import { existsSync } from 'fs';
import { Readable } from 'stream';
import { unlink } from 'fs/promises';
import { pipeline } from 'node:stream/promises';
import type { StorageBackend } from '../interface';
import { BaseStorageBackend } from '../base';

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
    const readable = Readable.from(stream);

    return success(new FileContent(Readable.toWeb(readable)));
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
