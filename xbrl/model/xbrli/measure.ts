export class XbrlMeasure {
  value: string;

  static readonly EUR = new XbrlMeasure('iso4217:EUR');
  static readonly PURE = new XbrlMeasure('xbrli:pure');

  constructor(value: string) {
    this.value = value;
  }
}
