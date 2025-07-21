export interface ElsterDruckParameter {
  version: number;
  vorschau: number;
  duplexDruck: number;
  pdfName: string | null;
  fussText: string | null;
  pdfCallbackBenutzerdaten: string | null;
  pdfCallback: ((name: string, data: unknown, size: number) => void) | null;
}
