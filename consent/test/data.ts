import { randomUUID } from 'crypto';
import { Consent } from '../domain/model/Consent';
import { ConsentStatus } from '../domain/model/ConsentStatus';

export const purpose = 'test';
export const consent1 = randomUUID();
export const consent2 = randomUUID();
export const subject1 = randomUUID();
export const subject2 = randomUUID();

export const data1 = [
  new Consent({
    id: consent2,
    purpose: purpose,
    subject: subject2,
    status: ConsentStatus.Denied,
    createdAt: new Date('2025-05-05'),
  }),
  new Consent({
    id: randomUUID(),
    purpose: purpose,
    subject: subject2,
    status: ConsentStatus.Granted,
    createdAt: new Date('2025-02-05'),
  }),
  new Consent({
    id: consent1,
    purpose: purpose,
    subject: subject1,
    status: ConsentStatus.Granted,
    createdAt: new Date('2025-01-05'),
  }),
  new Consent({
    id: randomUUID(),
    purpose: purpose,
    subject: subject1,
    status: ConsentStatus.Granted,
    createdAt: new Date('2025-01-01'),
  }),
  new Consent({
    id: randomUUID(),
    purpose: purpose,
    subject: subject1,
    status: ConsentStatus.Denied,
    createdAt: new Date('2025-01-04'),
  }),
];

export const data2 = [
  new Consent({
    id: consent1,
    purpose: purpose,
    subject: subject1,
    status: ConsentStatus.Granted,
    createdAt: new Date('2025-01-05'),
  }),
  new Consent({
    id: randomUUID(),
    purpose: purpose,
    subject: subject1,
    status: ConsentStatus.Denied,
    createdAt: new Date('2025-01-04'),
  }),
  new Consent({
    id: randomUUID(),
    purpose: purpose,
    subject: subject1,
    status: ConsentStatus.Granted,
    createdAt: new Date('2025-01-01'),
  }),
];

export const data3 = [
  new Consent({
    id: consent2,
    purpose: purpose,
    subject: subject2,
    status: ConsentStatus.Denied,
    createdAt: new Date('2025-05-05'),
  }),
  new Consent({
    id: randomUUID(),
    purpose: purpose,
    subject: subject2,
    status: ConsentStatus.Granted,
    createdAt: new Date('2025-02-05'),
  }),
];
