import type { Result } from '../result';

export interface Repository<T> {
  insert(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Result<T, 'entity_not_found' | 'mapping_error'>>;
  findAll(): Promise<Result<T, 'entity_not_found' | 'mapping_error'>[]>;
}
