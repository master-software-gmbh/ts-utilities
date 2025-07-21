export interface ElsterVorgangErgebnis {
  xml: string;
  pdf: Buffer | null;
  rueckgabeXml: string;
  serverantwortXml: string;
}
