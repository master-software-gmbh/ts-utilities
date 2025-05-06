import type { ConsentRepository } from './ConsentRepository';
import { Consent } from './model/Consent';
import type { ConsentStatus } from './model/ConsentStatus';

export class ConsentService {
  private readonly repository: ConsentRepository;

  constructor(repository: ConsentRepository) {
    this.repository = repository;
  }

  async storeConsent(subject: string, status: ConsentStatus, purpose: string): Promise<Consent> {
    const consent = new Consent({
      status,
      subject,
      purpose,
    });

    await this.repository.add(consent);

    return consent;
  }

  async getConsent(subject: string, purpose: string): Promise<Consent | null> {
    const [consent] = await this.repository.byPurpose(purpose).bySubject(subject).all();

    if (!consent) {
      return null;
    }

    return consent;
  }

  async getLatestConsents(purpose: string, status?: ConsentStatus): Promise<Record<string, Consent>> {
    const consents = await this.repository.byPurpose(purpose).all();

    const latestConsents = consents.reduce((acc: Record<string, Consent>, consent: Consent) => {
      const currentConsent = acc[consent.subject];

      if (!currentConsent || currentConsent.createdAt < consent.createdAt) {
        acc[consent.subject] = consent;
      }

      return acc;
    }, {});

    if (status) {
      return Object.fromEntries(Object.entries(latestConsents).filter(([, consent]) => consent.status === status));
    }

    return latestConsents;
  }
}
