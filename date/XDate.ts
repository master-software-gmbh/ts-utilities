import { Quarter } from './Quarter';

export class XDate {
  readonly day: number;
  readonly year: number;
  readonly month: number;

  constructor(year?: number, month?: number, day?: number) {
    const now = new Date();

    this.day = day ?? now.getDate();
    this.year = year ?? now.getFullYear();
    this.month = month ?? now.getMonth() + 1;
  }

  /**
   * Parses an ISO date string (YYYY-MM-DD) into an XDate
   */
  static fromISO(isoString: string): XDate {
    const [match, yearStr, monthStr, dayStr] = isoString.match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? [];
    if (!match) throw new Error(`Invalid ISO date: ${isoString}`);

    return new XDate(Number(yearStr), Number(monthStr), Number(dayStr));
  }

  /**
   * Returns the quarter the given month is a part of
   * @param month The month as a number between 0 and 11. Defaults to the current month
   */
  static getQuarter(date = new XDate()): Quarter {
    const number = Math.floor((date.month - 1) / 3) + 1;
    return new Quarter(date.year, number as 1 | 2 | 3 | 4);
  }

  /**
   * Returns the quarter the date is a part of
   */
  getQuarter(): Quarter {
    return XDate.getQuarter(this);
  }

  /**
   * Returns a copy of the date with the number of months added
   */
  addMonths(months: number): XDate {
    return this.copy({
      month: this.month + months,
    });
  }

  /**
   * Returns a copy of the date with the number of months subtracted
   */
  subtractMonths(months: number): XDate {
    return this.addMonths(-months);
  }

  /**
   * Returns a copy of the date with the number of days added
   */
  addDays(days: number): XDate {
    return this.copy({
      day: this.day + days,
    });
  }

  /**
   * Returns a copy of the date with the number of years added
   */
  addYears(years: number): XDate {
    return this.copy({
      year: this.year + years,
    });
  }

  /**
   * Returns a copy of the date with the number of days subtracted
   */
  subtractDays(days: number): XDate {
    return this.addDays(-days);
  }

  /**
   * Returns a copy of the date set to the first day of the month
   */
  atMonthStart(): XDate {
    return this.copy({
      day: 1,
    });
  }

  /**
   * Returns a copy of the date set to the last day of the month
   */
  atMonthEnd(): XDate {
    return this.atMonthStart().addMonths(1).subtractDays(1);
  }

  /**
   * Returns a copy of the date set to the first day of the year
   */
  atYearStart(): XDate {
    return this.copy({
      day: 1,
      month: 1,
    });
  }

  /**
   * Returns a copy of the date set to the last day of the year
   */
  atYearEnd(): XDate {
    return this.copy({
      day: 31,
      month: 12,
    });
  }

  /**
   * Returns a copy of the date with the applied overrides
   */
  copy(overrides?: {
    day?: number;
    year?: number;
    month?: number;
  }): XDate {
    return this.normalize(
      overrides?.year !== undefined ? overrides.year : this.year,
      overrides?.month !== undefined ? overrides.month : this.month,
      overrides?.day !== undefined ? overrides.day : this.day,
    );
  }

  /**
   * Returns the date in ISO format (YYYY-MM-DD)
   */
  toISODateString(): string {
    const YYYY = this.year;
    const MM = this.month.toString().padStart(2, '0');
    const DD = this.day.toString().padStart(2, '0');

    return `${YYYY}-${MM}-${DD}`;
  }

  private normalize(year: number, month: number, day: number): XDate {
    const normalizedDate = new Date(year, month - 1, day);
    return new XDate(normalizedDate.getFullYear(), normalizedDate.getMonth() + 1, normalizedDate.getDate());
  }
}
