import { XmlNamespace } from '../../../xml';
import { HgbrefFiscalRequirement } from '../../../xml/model/hgbref/fiscal-requirement';
import { ReferenceName } from '../../../xml/model/hgbref/reference-name';
import { XmlNamespaces } from '../../../xml/model/namespaces';
import type { XsElement } from '../../../xml/model/xs/element';
import type { XbrlLabel } from './label';
import type { XbrlReference } from './reference';

export class XbrlConcept {
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

  get isMandatoryDisclosure(): boolean {
    const mandatoryDisclosureReferences = this.getReferencesByRole(
      'http://www.xbrl.org/2003/role/mandatoryDisclosureRef',
    );

    for (const reference of mandatoryDisclosureReferences) {
      const value = reference.getValue({
        name: ReferenceName.fiscalRequirement,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof HgbrefFiscalRequirement) {
        return value.isRequired;
      }
    }

    return false;
  }
}
