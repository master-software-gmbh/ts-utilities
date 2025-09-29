import { XbrlConcept } from './concept';

export class XbrlTuple extends XbrlConcept {
  children: unknown[];

  constructor(data: {
    id: string | null;
    nillable: boolean;
    abstract: boolean;
    name: string | null;
    type: string | null;
    children: unknown[];
    targetNamespace: string | null;
    substitutionGroup: string | null;
  }) {
    super(data);
    this.children = data.children;
  }
}
