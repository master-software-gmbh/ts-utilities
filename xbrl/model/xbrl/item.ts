import type { XsElement } from '../../../xml/model/xs/element';
import type { XbrliBalance } from './balance';
import { XbrlConcept } from './concept';
import type { XbrliPeriodType } from './period-type';

export class XbrlItem extends XbrlConcept {
  balance?: XbrliBalance;
  periodType?: XbrliPeriodType;

  constructor(element: XsElement, balance?: XbrliBalance, periodType?: XbrliPeriodType) {
    super(element);
    this.balance = balance;
    this.periodType = periodType;
  }
}
