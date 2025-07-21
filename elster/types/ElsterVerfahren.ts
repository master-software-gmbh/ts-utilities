export const ElsterVerfahren = {
  Bilanz: 'ElsterBilanz',
  Anmeldung: 'ElsterAnmeldung',
  Erklaerung: 'ElsterErklaerung',
  Datenabholung: 'ElsterDatenabholung',
} as const;

export type ElsterVerfahren = (typeof ElsterVerfahren)[keyof typeof ElsterVerfahren];
