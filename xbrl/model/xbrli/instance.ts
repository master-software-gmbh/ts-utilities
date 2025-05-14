import type { XbrlContext } from './context';
import type { XbrlFact } from './fact';
import type { XbrlUnit } from './unit';

export class XbrlInstance {
  facts: XbrlFact[];
  units: XbrlUnit[];
  contexts: XbrlContext[];

  constructor(facts: XbrlFact[], units: XbrlUnit[], contexts: XbrlContext[]) {
    this.facts = facts;
    this.units = units;
    this.contexts = contexts;
  }
}
