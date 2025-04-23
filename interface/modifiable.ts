import type { Result } from '../result';
import type { ID, Identifiable } from './identifiable';

export interface Modifiable<I extends ID, T extends Identifiable<I>> {
  save(entity: T): Promise<void>;
  add(entity: T): Promise<Result<void, 'entity_already_exists'>>;
  update(entity: T): Promise<Result<void, 'entity_doesnt_exist'>>;
  remove(id: I): Promise<Result<void, 'entity_doesnt_exist'>>;
}
