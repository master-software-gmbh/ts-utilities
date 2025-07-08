import { DateRange } from './DateRange';
import { XDate } from './XDate';

export class Quarter {
  year: number;
  index: 0 | 1 | 2 | 3;

  constructor(year: number, index: 0 | 1 | 2 | 3) {
    this.year = year;
    this.index = index;
  }

  get number(): number {
    return this.index + 1;
  }

  /**
   * Inclusive start date of the quarter
   */
  get startDate(): XDate {
    return new XDate(this.year, this.number * 3 - 3, 1);
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
