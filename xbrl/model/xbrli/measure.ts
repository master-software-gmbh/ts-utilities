export class XbrlMeasure {
  value: string;

  static readonly EUR = new XbrlMeasure('iso4217:EUR');

  constructor(value: string) {
    this.value = value;
  }
}
