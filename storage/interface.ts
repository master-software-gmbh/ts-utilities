import type { Result } from '../result';
import type { FileContent, Folder } from './types';

export interface StorageBackend {
  root: Folder;

  /**
   * Checks if a file with the given key exists.
   */
  fileExists(key: string): Promise<boolean>;

  /**
   * Retrieves the file content.
   */
  getFile(key: string): Promise<Result<FileContent, 'file_not_found'>>;

  /**
   * Creates a file
   * @returns key of the file
   */
  createFile(
    source: ReadableStream,
    data?: {
      type?: string;
      key?: string;
    },
  ): Promise<string>;

  /**
   * Deletes a file.
   */
  deleteFile(key: string): Promise<void>;
}
