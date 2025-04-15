import type { Describable } from '../interface/describable';
import { Fraction } from './fractions';

export class Percentage extends Fraction implements Describable {
  constructor(amount: number) {
    super(amount, 100);
  }

  override description(): string {
    return `${this.numerator} %`;
  }

  inverse(): Percentage {
    return new Percentage(100 - this.numerator);
  }

  override multiplyWith(percentage: Percentage): Percentage;
  override multiplyWith(fraction: Fraction): Fraction;
  override multiplyWith(number: number): number;
  override multiplyWith(value: number | Fraction | Percentage): number | Fraction | Percentage {
    if (value instanceof Percentage) {
      return new Percentage((this.numerator * value.numerator) / 100);
    }

    if (value instanceof Fraction) {
      return super.multiplyWith(value);
    }

    return super.multiplyWith(value);
  }
}
