import { DateRange } from './DateRange';
import { XDate } from './XDate';

export class Quarter {
  year: number;
  number: 1 | 2 | 3 | 4;

  constructor(year: number, number: 1 | 2 | 3 | 4) {
    this.year = year;
    this.number = number;
  }

  /**
   * Inclusive start date of the quarter
   */
  get startDate(): XDate {
    return new XDate(this.year, this.number * 3 - 2, 1);
  }

  /**
   * Exclusive end date of the quarter
   */
  get endDate(): XDate {
    return this.startDate.addMonths(3);
  }

  /**
   * Date range of the quarter
   */
  get range(): DateRange {
    return new DateRange(this.startDate, this.endDate);
  }
}
