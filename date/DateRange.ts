import { XDate } from './XDate';

export class DateRange implements Iterable<XDate> {
  /**
   * Inclusive start of the range
   */
  from: XDate;

  /**
   * Exclusive end of the range
   */
  until: XDate;

  /**
   * Creates a DateRange instance
   * @param from Inclusive start of the range
   * @param until Exclusive end of the range
   */
  constructor(from: XDate, until: XDate) {
    this.from = from;
    this.until = until;
  }

  [Symbol.iterator](): Iterator<XDate> {
    return new DateRangeIterator(this);
  }
}

class DateRangeIterator implements Iterator<XDate> {
  private current: XDate;
  private end: XDate;

  constructor(range: DateRange) {
    this.current = range.from;
    this.end = range.until;
  }

  next(): IteratorResult<XDate> {
    if (this.current >= this.end) {
      return { done: true, value: undefined };
    }

    const result = this.current.copy();
    this.current = this.current.addDays(1);

    return { done: false, value: result };
  }
}
