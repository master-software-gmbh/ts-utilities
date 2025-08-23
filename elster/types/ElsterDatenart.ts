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

  /**
   * Postfach-Anfrage
   */
  PostfachAnfrage: 'PostfachAnfrage',

  /**
   * Postfach-Bestätigung
   */
  PostfachBestaetigung: 'PostfachBestaetigung',

  /**
   * Postfach-Status
   */
  PostfachStatus: 'PostfachStatus',
} as const;

export type ElsterDatenart = (typeof ElsterDatenart)[keyof typeof ElsterDatenart];
