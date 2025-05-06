import type { Modifiable, Retrievable } from '../../interface';
import type { Consent } from './model/Consent';

export type ConsentRepository = Retrievable<string, Consent> &
  Modifiable<string, Consent> & {
    bySubject(subject: string): ConsentRepository;
    byPurpose(purpose: string): ConsentRepository;
    byStatus(status: string): ConsentRepository;
  };
