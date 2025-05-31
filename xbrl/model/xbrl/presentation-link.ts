import type { XbrlConcept } from './concept';

export class XbrlPresentationLink {
  from: XbrlConcept;
  to: XbrlConcept;
  role: string;

  constructor(from: XbrlConcept, to: XbrlConcept, role: string) {
    this.from = from;
    this.to = to;
    this.role = role;
  }
}
