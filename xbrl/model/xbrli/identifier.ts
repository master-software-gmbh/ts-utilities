export class XbrlIdentifier {
  scheme: string;
  value: string;

  constructor(scheme: string, value: string) {
    this.value = value;
    this.scheme = scheme;
  }
}
