import { randomUUID } from 'node:crypto';
import type { Folder } from './types';

export abstract class BaseStorageBackend {
  readonly root: Folder;

  constructor(root: Folder) {
    this.root = root;
  }

  protected getId(key?: string): { key: string; path: string } {
    key ??= randomUUID();

    const path = this.root.resolve(key);

    return {
      key: key,
      path: path,
    };
  }
}
