export class ElsterDatenlieferant {
  ort: string | null;
  land: string | null;
  name: string | null;
  email: string | null;
  telefon: string | null;
  strasse: string | null;
  hausnummer: string | null;
  adresszusatz: string | null;
  postleitzahl: string | null;
  hausnummerzusatz: string | null;

  constructor(data: {
    ort?: string | null;
    land?: string | null;
    name?: string | null;
    email?: string | null;
    telefon?: string | null;
    strasse?: string | null;
    hausnummer?: string | null;
    adresszusatz?: string | null;
    postleitzahl?: string | null;
    hausnummerzusatz?: string | null;
  }) {
    this.ort = data.ort ?? null;
    this.land = data.land ?? null;
    this.name = data.name ?? null;
    this.email = data.email ?? null;
    this.telefon = data.telefon ?? null;
    this.strasse = data.strasse ?? null;
    this.hausnummer = data.hausnummer ?? null;
    this.adresszusatz = data.adresszusatz ?? null;
    this.postleitzahl = data.postleitzahl ?? null;
    this.hausnummerzusatz = data.hausnummerzusatz ?? null;
  }

  toString(): string {
    const parts = [
      this.name,
      this.strasse,
      this.hausnummer,
      this.hausnummerzusatz,
      this.adresszusatz,
      this.postleitzahl,
      this.ort,
      this.land,
      this.telefon,
      this.email,
    ];

    return parts.map((part) => (part !== null ? part : '')).join('; ');
  }
}
