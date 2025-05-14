import type { XbrlConcept } from '../xbrl/concept';
import type { XbrlContext } from './context';
import type { XbrlUnit } from './unit';

export class XbrlFact {
  nil: boolean;
  value: string;
  unit?: XbrlUnit;
  decimals?: number;
  concept: XbrlConcept;
  context?: XbrlContext;

  constructor(
    nil: boolean,
    value: string,
    concept: XbrlConcept,
    unit?: XbrlUnit,
    decimals?: number,
    context?: XbrlContext,
  ) {
    this.nil = nil;
    this.unit = unit;
    this.value = value;
    this.concept = concept;
    this.context = context;
    this.decimals = decimals;
  }
}
