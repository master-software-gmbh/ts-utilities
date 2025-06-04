import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import type { Folder } from './types';

export abstract class BaseStorageBackend {
  readonly root: Folder;

  constructor(root: Folder) {
    this.root = root;
  }

  protected getId(key?: string): { key: string; path: string } {
    key ??= randomUUID();

    const path = resolve(this.root.path, key);

    return {
      key: key,
      path: path,
    };
  }
}
