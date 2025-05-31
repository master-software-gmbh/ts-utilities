import type { XbrlMeasure } from './measure';

export class XbrlUnit {
  id: string;
  measures: XbrlMeasure[];

  constructor(id: string, measures: XbrlMeasure[]) {
    this.id = id;
    this.measures = measures;
  }
}
