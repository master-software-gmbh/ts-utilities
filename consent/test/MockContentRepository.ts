import type { ConsentRepository } from '../domain/ConsentRepository';
import type { Consent } from '../domain/model/Consent';

export const mockRepository: (c: Consent[]) => ConsentRepository = (consents) => ({
  byPurpose() {
    return this;
  },
  byStatus() {
    return this;
  },
  bySubject() {
    return this;
  },
  ofId() {
    throw new Error('Method not implemented.');
  },
  add() {
    throw new Error('Method not implemented.');
  },
  remove() {
    throw new Error('Method not implemented.');
  },
  save() {
    throw new Error('Method not implemented.');
  },
  update() {
    throw new Error('Method not implemented.');
  },
  async all() {
    return consents;
  },
});
