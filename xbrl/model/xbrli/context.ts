import type { XbrlEntity } from './entity';
import type { XbrlPeriod } from './period';
import type { XbrlScenario } from './scenario';

export class XbrlContext {
  id: string;
  entity: XbrlEntity;
  period: XbrlPeriod;
  scenario?: XbrlScenario;

  constructor(id: string, entity: XbrlEntity, period: XbrlPeriod, scenario?: XbrlScenario) {
    this.id = id;
    this.entity = entity;
    this.period = period;
    this.scenario = scenario;
  }
}
