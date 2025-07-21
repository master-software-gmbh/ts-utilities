export const ElsterVerfahren = {
  Bilanz: 'ElsterBilanz',
  Anmeldung: 'ElsterAnmeldung',
  Erklaerung: 'ElsterErklaerung',
  SteuerlicheErfassung: 'ElsterFSE',
  Datenabholung: 'ElsterDatenabholung',
} as const;

export type ElsterVerfahren = (typeof ElsterVerfahren)[keyof typeof ElsterVerfahren];
