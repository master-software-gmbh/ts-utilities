export class XbrlPeriod {
  value:
    | string
    | {
        startDate: string;
        endDate: string;
      };

  constructor(
    value:
      | string
      | {
          startDate: string;
          endDate: string;
        },
  ) {
    this.value = value;
  }
}
