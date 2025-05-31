import type { XbrlConcept } from './concept';

export class XbrlCalculationLink {
  from: XbrlConcept;
  to: XbrlConcept;
  weight: number;
  role: string;

  constructor(from: XbrlConcept, to: XbrlConcept, weight: number, role: string) {
    this.from = from;
    this.to = to;
    this.weight = weight;
    this.role = role;
  }
}
