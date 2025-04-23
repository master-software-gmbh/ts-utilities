import type { Result } from '../result';
import type { ID, Identifiable } from './identifiable';

export interface Retrievable<I extends ID, T extends Identifiable<I>> {
  all(): Promise<T[]>;
  ofId(id: I): Promise<Result<T, 'entity_doesnt_exist'>>;
}
