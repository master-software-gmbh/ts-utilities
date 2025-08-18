/**
 * Die Vorgangsart bestimmt, wie die Steuerdaten elektronisch übermittelt werden.
 */
export const ElsterVorgangsart = {
  /**
   * Daten werden signiert versendet.
   */
  sendAuth: 'send-Auth',

  /**
   * Daten werden nicht signiert.
   * Bei Jahressteuererklärungen ist eine vom Steuerpflichtigen unterschriebene komprimierte Steuererklärung beim Finanzamt nachzureichen.
   */
  sendNoSig: 'send-NoSig',

  /**
   * Zum Signieren ist ein Portalzertifikat notwendig.
   */
  sendAuthPart: 'send-Auth-Part',
} as const;

export type ElsterVorgangsart = (typeof ElsterVorgangsart)[keyof typeof ElsterVorgangsart];
