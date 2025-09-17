import type { XbrliBalance } from './balance';
import { XbrlConcept } from './concept';
import type { XbrliPeriodType } from './period-type';

export class XbrlItem extends XbrlConcept {
  balance?: XbrliBalance;
  periodType?: XbrliPeriodType;

  constructor(id?: string, name?: string, targetNamespace?: string, balance?: XbrliBalance, periodType?: XbrliPeriodType) {
    super(id, name, targetNamespace);
    this.balance = balance;
    this.periodType = periodType;
  }
}
