export class XbrlRole {
  definition?: string;
  usedOn: string[];

  constructor(usedOn: string[], definition?: string) {
    this.usedOn = usedOn;
    this.definition = definition;
  }
}
