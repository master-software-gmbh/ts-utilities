import { Quarter } from './Quarter';

export class XDate extends Date {
  /**
   * Returns the quarter the given month is a part of
   * @param month The month as a number between 0 and 11. Defaults to the current month
   */
  static getQuarter(date = new Date()): Quarter {
    const year = date.getFullYear();
    const index = Math.floor(date.getMonth() / 3);

    return new Quarter(year, index as 0 | 1 | 2 | 3);
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
      month: this.getMonth() + months,
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
      day: this.getDate() + days,
    });
  }

  /**
   * Returns a copy of the date with the number of days subtracted
   */
  subtractDays(days: number): XDate {
    return this.addDays(-days);
  }

  /**
   * Returns a copy of the date with the number of hours added
   */
  addHours(hours: number): XDate {
    return this.copy({
      hours: this.getHours() + hours,
    });
  }

  /**
   * Returns a copy of the date with the number of hours subtracted
   */
  subtractHours(hours: number): XDate {
    return this.addHours(-hours);
  }

  /**
   * Returns a copy of the date set to the first day of the month
   */
  atMonthStart(): XDate {
    return this.copy({
      day: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  }

  /**
   * Returns a copy of the date set to the last day of the month
   */
  atMonthEnd(): XDate {
    return this.addMonths(1).subtractDays(-1);
  }

  /**
   * Returns a copy of the date with the applied overrides
   */
  copy(overrides?: {
    day?: number;
    year?: number;
    month?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  }): XDate {
    return new XDate(
      new Date(
        overrides?.year !== undefined ? overrides.year : this.getFullYear(),
        overrides?.month !== undefined ? overrides.month : this.getMonth(),
        overrides?.day !== undefined ? overrides.day : this.getDate(),
        overrides?.hours !== undefined ? overrides.hours : this.getHours(),
        overrides?.minutes !== undefined ? overrides.minutes : this.getMinutes(),
        overrides?.seconds !== undefined ? overrides.seconds : this.getSeconds(),
        overrides?.milliseconds !== undefined ? overrides.milliseconds : this.getMilliseconds(),
      ),
    );
  }

  /**
   * Returns the date in ISO format (YYYY-MM-DD)
   */
  toISODateString(): string {
    const YYYY = this.getFullYear();
    const MM = (this.getMonth() + 1).toString().padStart(2, '0');
    const DD = this.getDate().toString().padStart(2, '0');

    return `${YYYY}-${MM}-${DD}`;
  }
}
