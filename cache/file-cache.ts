import { hash } from '../crypto';
import type { FileContent, StorageBackend } from '../storage';
import type { NestedRecord, Primitive } from '../types';
import type { Cache } from './interface';

type CacheKey = Primitive | NestedRecord;

export class FileStorageCache implements Cache<CacheKey, FileContent> {
  private readonly backend: StorageBackend;

  constructor(backend: StorageBackend) {
    this.backend = backend;
  }

  has(key: CacheKey): Promise<boolean> {
    return this.backend.fileExists(this.hashKey(key));
  }

  async set(key: CacheKey, value: FileContent): Promise<void> {
    await this.backend.createFile(value.stream, {
      type: value.type,
      key: this.hashKey(key),
    });
  }

  async get(key: CacheKey): Promise<FileContent | undefined> {
    const result = await this.backend.getFile(this.hashKey(key));

    if (!result.success) {
      return;
    }

    return result.data;
  }

  private hashKey(key: CacheKey): string {
    return hash(key);
  }
}
