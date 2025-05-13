import { existsSync, mkdirSync } from 'fs';
import type { Cache } from './interface';
import { readdir, unlink, writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import { createHash } from 'crypto';

export class FileCache implements Cache<string> {
  private readonly folder: string;

  constructor(folder: string) {
    this.folder = folder;
    mkdirSync(folder, { recursive: true });
  }

  async clear(): Promise<void> {
    const keys = await this.keys();

    for (const key of keys) {
      await this.delete(key);
    }
  }

  async keys(): Promise<string[]> {
    return readdir(this.folder);
  }

  async has(key: string): Promise<boolean> {
    const path = this.getPath(key);
    return existsSync(path);
  }

  async delete(key: string): Promise<void> {
    const path = this.getPath(key);

    if (existsSync(path)) {
      await unlink(path);
    }
  }

  async set(key: string, value: string): Promise<void> {
    const path = this.getPath(key);
    await writeFile(path, value);
  }

  async get(key: string): Promise<string | undefined> {
    const path = this.getPath(key);

    if (existsSync(path)) {
      return readFile(path, 'utf-8');
    }
  }

  private getPath(key: string): string {
    const hash = createHash('sha256').update(key).digest('hex');
    return resolve(this.folder, hash);
  }
}
