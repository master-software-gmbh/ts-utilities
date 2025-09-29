import type { XbrliBalance } from './balance';
import { XbrlConcept } from './concept';
import type { XbrliPeriodType } from './period-type';

export class XbrlItem extends XbrlConcept {
  balance?: XbrliBalance;
  periodType?: XbrliPeriodType;

  constructor(data: {
    id: string | null;
    name: string | null;
    type: string | null;
    nillable: boolean;
    abstract: boolean;
    balance?: XbrliBalance;
    periodType?: XbrliPeriodType;
    targetNamespace: string | null;
    substitutionGroup: string | null;
  }) {
    super(data);
    this.balance = data.balance;
    this.periodType = data.periodType;
  }
}
