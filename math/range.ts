import type { Describable } from '../interface/describable';

export class Range implements Describable {
  from: number;
  to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  description(): string {
    return `Range from ${this.from} to ${this.to}`;
  }

  sequence(): number[] {
    const result: number[] = [];

    for (let i = this.from; i <= this.to; i++) {
      result.push(i);
    }

    return result;
  }
}
