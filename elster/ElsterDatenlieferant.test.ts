import { describe, expect, it } from 'bun:test';
import { ElsterDatenlieferant } from './types/ElsterDatenlieferant';

describe('ElsterDatenlieferant', () => {
  const datenlieferant = new ElsterDatenlieferant({
    hausnummer: '52',
    ort: 'Musterstadt',
    postleitzahl: '12345',
    name: 'Max Mustermann',
    strasse: 'Musterstraße',
    telefon: '+49 1234 5678',
    email: 'max@mustermann.de',
  });

  it('should return string', () => {
    expect(datenlieferant.toString()).toEqual(
      'Max Mustermann; Musterstraße; 52; ; ; 12345; Musterstadt; ; +49 1234 5678; max@mustermann.de',
    );
  });

  it('should return adresszeile', () => {
    expect(datenlieferant.adresszeile).toEqual('Musterstraße 52');
  });

  it('should return adresszeile with hausnummernzusatz', () => {
    const datenlieferant = new ElsterDatenlieferant({
      hausnummer: '52',
      ort: 'Musterstadt',
      postleitzahl: '12345',
      name: 'Max Mustermann',
      strasse: 'Musterstraße',
      hausnummernzusatz: 'c',
      telefon: '+49 1234 5678',
      email: 'max@mustermann.de',
    });

    expect(datenlieferant.adresszeile).toEqual('Musterstraße 52 c');
  });
});
