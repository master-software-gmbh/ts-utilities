import { type Result, error, success } from '../../result';
import { Folder, type StorageBackend } from '../../storage';
import type { FileRepository } from './FileRepository';
import { FileEntity, type FileInput } from './file';

export class FileService {
  private readonly repository: FileRepository;
  private readonly backends: Map<string, StorageBackend>;

  constructor(repository: FileRepository) {
    this.backends = new Map();
    this.repository = repository;
  }

  addBackend(backend: StorageBackend): Result<void, 'backend_already_exists'> {
    const path = backend.root.path;

    if (this.backends.has(path)) {
      return error('backend_already_exists');
    }

    this.backends.set(path, backend);

    return success();
  }

  async createFile(source: FileInput, folder = Folder.ROOT, id?: string): Promise<FileEntity> {
    const backend = this.getBackendOrThrow(folder);
    const key = await backend.createFile(source.stream(), {
      type: source.type,
    });

    const file = new FileEntity({ id: id, key: key, name: source.name, type: source.type });

    await this.repository.insert(file);

    const { data } = await backend.getFile(file.key);

    if (data) {
      file.data = data;
    }

    return file;
  }

  async getFileById(id: string, folder = Folder.ROOT): Promise<FileEntity | null> {
    const backend = this.getBackendOrThrow(folder);
    const { data: file } = await this.repository.findById(id);

    if (!file) {
      return null;
    }

    const { data } = await backend.getFile(file.key);

    if (data) {
      file.data = data;
    }

    return file;
  }

  async deleteFile(id: string, folder = Folder.ROOT): Promise<Result<void, 'file_not_found'>> {
    const backend = this.getBackendOrThrow(folder);
    const { data: file } = await this.repository.findById(id);

    if (!file) {
      return error('file_not_found');
    }

    await backend.deleteFile(file.key);
    await this.repository.delete(file.id);

    return success();
  }

  private getBackendOrThrow(folder: Folder): StorageBackend {
    const backend = this.backends.get(folder.path);

    if (!backend) {
      throw new Error(`No storage backend found for folder: ${folder.path}`);
    }

    return backend;
  }
}
