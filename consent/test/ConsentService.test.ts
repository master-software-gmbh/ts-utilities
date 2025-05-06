import { describe, expect, it } from 'bun:test';
import { ConsentService } from '../domain/ConsentService';
import { Consent } from '../domain/model/Consent';
import { ConsentStatus } from '../domain/model/ConsentStatus';
import { mockRepository } from './MockContentRepository';
import { consent1, consent2, data1, data2, data3, purpose, subject1, subject2 } from './data';

describe('ConsentService', () => {
  it('should return latest consents', async () => {
    const service = new ConsentService(mockRepository(data1));
    const result = await service.getLatestConsents(purpose);

    expect(result).toEqual({
      [subject2]: new Consent({
        id: consent2,
        purpose: purpose,
        subject: subject2,
        status: ConsentStatus.Denied,
        createdAt: new Date('2025-05-05'),
      }),
      [subject1]: new Consent({
        id: consent1,
        purpose: purpose,
        subject: subject1,
        status: ConsentStatus.Granted,
        createdAt: new Date('2025-01-05'),
      }),
    });
  });

  it('should return latest consents', async () => {
    const service = new ConsentService(mockRepository(data1));
    const result = await service.getLatestConsents(purpose, ConsentStatus.Granted);

    expect(result).toEqual({
      [subject1]: new Consent({
        id: consent1,
        purpose: purpose,
        subject: subject1,
        status: ConsentStatus.Granted,
        createdAt: new Date('2025-01-05'),
      }),
    });
  });

  it('should return latest consent', async () => {
    let service = new ConsentService(mockRepository(data2));
    let result = await service.getConsent(subject1, purpose);

    expect(result).toEqual(
      new Consent({
        id: consent1,
        purpose: purpose,
        subject: subject1,
        status: ConsentStatus.Granted,
        createdAt: new Date('2025-01-05'),
      }),
    );

    service = new ConsentService(mockRepository(data3));
    result = await service.getConsent(subject2, purpose);

    expect(result).toEqual(
      new Consent({
        id: consent2,
        purpose: purpose,
        subject: subject2,
        status: ConsentStatus.Denied,
        createdAt: new Date('2025-05-05'),
      }),
    );
  });
});
