import type { XbrlConcept } from '../xbrl/concept';
import type { XbrlContext } from './context';
import type { XbrlUnit } from './unit';

export class XbrlFact {
  nil: boolean;
  value: (string | XbrlFact)[];
  unit?: XbrlUnit;
  decimals?: number;
  concept: XbrlConcept;
  context?: XbrlContext;

  constructor(
    nil: boolean,
    value: (string | XbrlFact)[],
    concept: XbrlConcept,
    context?: XbrlContext,
    unit?: XbrlUnit,
    decimals?: number,
  ) {
    this.nil = nil;
    this.unit = unit;
    this.value = value;
    this.concept = concept;
    this.context = context;
    this.decimals = decimals;
  }
}
