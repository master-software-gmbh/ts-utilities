import type { XsElement } from '../../../xml/model/xs/element';
import type { XsSchema } from '../../../xml/model/xs/schema';
import type { XbrlLabel } from './label';
import type { XbrlReference } from './reference';

export class XbrlConcept {
  schema?: XsSchema;
  element: XsElement;
  labels: XbrlLabel[];
  references: XbrlReference[];

  constructor(element: XsElement) {
    this.labels = [];
    this.references = [];
    this.element = element;
  }

  addLabel(label: XbrlLabel) {
    this.labels.push(label);
  }

  addReference(reference: XbrlReference) {
    this.references.push(reference);
  }

  get id(): string | undefined {
    return this.element.id;
  }

  get name(): string | undefined {
    return this.element.name;
  }

  getReferencesByRole(role: string): XbrlReference[] {
    return this.references.filter((reference) => reference.role === role);
  }
}
