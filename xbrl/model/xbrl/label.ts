export class XbrlLabel {
  id?: string;
  lang?: string;
  role?: string;
  value: string;

  constructor(value: string, id?: string, role?: string, lang?: string) {
    this.id = id;
    this.role = role;
    this.lang = lang;
    this.value = value;
  }
}
