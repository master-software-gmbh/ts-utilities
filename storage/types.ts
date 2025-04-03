import type { Result } from '../result';

export interface Folder {
  path: string[];
}

export const ROOT_FOLDER: Folder = {
  path: [],
};

export interface StorageBackend {
  /**
   * Retrieves the file content as a stream
   * @param key key of the file
   */
  getFile(key: string): Promise<Result<ReadableStream, 'file_not_found'>>;

  /**
   * Creates a file
   * @param source stream of file content
   * @param folder folder to store the file in
   * @param type MIME type of the file
   * @returns key of the file
   */
  createFile(source: ReadableStream, folder?: Folder, type?: string): Promise<string>;

  /**
   * Deletes a file
   * @param key key of the file
   */
  deleteFile(key: string): Promise<void>;
}
