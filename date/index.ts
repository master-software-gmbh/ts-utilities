declare global {
  type Quarter = 1 | 2 | 3 | 4;

  interface Date {
    /**
     * Returns the date in ISO format (YYYY-MM-DD)
     */
    toISODateString(): string;

    /**
     * Creates a copy of the date with the number of days added
     * @param days number of days to add
     * @returns new date with days added
     */
    addDays(days: number): Date;

    /**
     * Creates a copy of the date with the number of days subtracted
     * @param days number of days to subtract
     * @returns new date with days subtracted
     */
    subtractDays(days: number): Date;

    /**
     * Creates a copy of the date with the number of hours added
     * @param hours number of hours to add
     * @returns new date with hours added
     */
    addHours(hours: number): Date;

    /**
     * Returns the quarter of the date.
     * @returns number between 1 and 4
     */
    getQuarter(): Quarter;
  }
}

Date.prototype.toISODateString = function () {
  const YYYY = this.getFullYear();
  const MM = (this.getMonth() + 1).toString().padStart(2, '0');
  const DD = this.getDate().toString().padStart(2, '0');

  return `${YYYY}-${MM}-${DD}`;
};

Date.prototype.addDays = function (days: number) {
  // Create a copy to prevent side effects
  const result = new Date(this ?? new Date());
  result.setDate(result.getDate() + days);
  return result;
};

Date.prototype.subtractDays = function (days: number) {
  return this.addDays(-days);
};

Date.prototype.addHours = function (hours: number) {
  // Create a copy to prevent side effects
  const result = new Date(this ?? new Date());
  result.setHours(result.getHours() + hours);
  return result;
};

Date.prototype.getQuarter = function () {
  return getQuarter(this.getMonth());
};

/**
 * Returns the quarter of a month
 * @param monthIndex index between 0 and 11, defaults to current month
 * @returns number between 1 and 4
 * @throws when monthIndex is not a valid month
 */
export function getQuarter(monthIndex?: number): Quarter {
  if (monthIndex === undefined) {
    monthIndex = new Date().getMonth();
  } else if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('monthIndex has to be a valid value between 0 and 11');
  }

  return Math.floor((monthIndex + 3) / 3) as Quarter;
}

/**
 * Returns the date range of the given quarter
 * @param year
 * @param quarter number between 1 and 4
 * @returns start and end date of the quarter
 */
export function getQuarterRange(
  year: number,
  quarter: number,
): {
  start: Date;
  end: Date;
} {
  if (quarter < 1 || quarter > 4) {
    throw new Error('Quarter has to be a valid value between 1 and 4');
  }

  const startMonth = quarter * 3 - 3;
  const endMonth = quarter * 3 - 1;

  const start = new Date(year, startMonth, 1);

  // The 0th day is the last day of the previous month
  const end = new Date(year, endMonth + 1, 0);

  return {
    start,
    end,
  };
}
