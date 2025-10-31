export interface ElsterVorgangErgebnis {
  xml: string;
  rueckgabeXml: string;
  serverantwortXml: string;
  pdf: Uint8Array<ArrayBuffer> | null;
}
