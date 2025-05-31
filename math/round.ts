declare global {
  interface Math {
    /**
     * Returns a supplied numeric expression rounded to the nearest integer.
     * @param x The value to be rounded to the nearest integer.
     */
    round(x: number, decimals?: number): number;

    /**
     * Returns the greatest integer less than or equal to its numeric argument.
     * @param x A numeric expression.
     */
    floor(x: number, decimals?: number): number;
  }
}

const round = Math.round;

Math.round = (x: number, decimals?: number) => {
  if (decimals === undefined) {
    return round(x);
  }

  const factor = Math.round(10 ** decimals);
  return Math.round(x * factor) / factor;
};

const floor = Math.floor;

Math.floor = (x: number, decimals?: number): number => {
  if (decimals === undefined) {
    return floor(x);
  }

  if (decimals < 0) {
    const factor = 10 ** -decimals;
    return Math.floor(x / factor) * factor;
  }

  const factor = 10 ** decimals;
  return Math.floor(x * factor) / factor;
};
