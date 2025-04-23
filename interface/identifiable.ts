export type ID = string | number;

export interface Identifiable<T extends ID = string> {
  id: T;
}
