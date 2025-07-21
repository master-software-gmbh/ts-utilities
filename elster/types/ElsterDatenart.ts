export const ElsterDatenart = {
  /**
   * Einkommensteuer
   */
  Est: 'ESt',

  /**
   * Gewerbesteuer
   */
  Gewst: 'GewSt',

  /**
   * Umsatzsteuer
   */
  Ust: 'USt',

  /**
   * Körperschaftsteuer
   */
  Kst: 'KSt',

  /**
   * Umsatzsteuervoranmeldung
   */
  Ustva: 'UStVA',

  /**
   * Bilanz
   */
  Bilanz: 'Bilanz',

  /**
   * Kapitalgesellschaft
   */
  Kapg: 'KapG',
} as const;

export type ElsterDatenart = (typeof ElsterDatenart)[keyof typeof ElsterDatenart];
