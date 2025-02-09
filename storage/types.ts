export interface Folder {
  path: string[];
}

export interface StorageBackend {
  /**
   * Retrieves the file content as a stream
   * @param key key of the file
   */
  getFile(key: string): Promise<ReadableStream>;

  /**
   * Creates a file
   * @param source stream of file content
   * @param folder folder to store the file in
   * @param type MIME type of the file
   * @returns key of the file
   */
  createFile(source: ReadableStream, folder: Folder, type?: string): Promise<string>;

  /**
   * Deletes a file
   * @param key key of the file
   */
  deleteFile(key: string): Promise<void>;
}
