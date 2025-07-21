export const ElsterDatenart = {
  /**
   * Einkommensteuer
   */
  est: 'ESt',

  /**
   * Gewerbesteuer
   */
  gewst: 'GewSt',

  /**
   * Umsatzsteuer
   */
  ust: 'USt',

  /**
   * Körperschaftsteuer
   */
  kst: 'KSt',

  /**
   * Umsatzsteuervoranmeldung
   */
  ustva: 'UStVA',

  /**
   * Bilanz
   */
  bilanz: 'Bilanz',
} as const;

export type ElsterDatenart = (typeof ElsterDatenart)[keyof typeof ElsterDatenart];
