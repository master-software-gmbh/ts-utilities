import { describe, expect, it } from 'bun:test';
import { ElsterDatenlieferant } from './types/ElsterDatenlieferant';

describe('ElsterDatenlieferant', () => {
  it('should return string', () => {
    const datenlieferant = new ElsterDatenlieferant({
      name: 'Max Mustermann',
      strasse: 'Musterstraße',
      hausnummer: '52',
      postleitzahl: '12345',
      ort: 'Musterstadt',
      email: 'max@mustermann.de',
      telefon: '+49 1234 5678',
    });

    expect(datenlieferant.toString()).toEqual(
      'Max Mustermann; Musterstraße; 52; ; ; 12345; Musterstadt; ; +49 1234 5678; max@mustermann.de',
    );
  });
});
