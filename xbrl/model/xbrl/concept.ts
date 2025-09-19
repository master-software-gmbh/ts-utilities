import { XmlNamespace } from '../../../xml';
import { HgbrefFiscalRequirement } from '../../../xml/model/hgbref/fiscal-requirement';
import { HgbrefNotPermittedFor } from '../../../xml/model/hgbref/not-permitted-for';
import { ReferenceName } from '../../../xml/model/hgbref/reference-name';
import { XmlNamespaces } from '../../../xml/model/namespaces';
import { XsDate } from '../../../xml/model/xs/date';
import type { XbrlLabel } from './label';
import type { XbrlReference } from './reference';

export class XbrlConcept {
  nillable: boolean;
  id: string | null;
  name: string | null;
  type: string | null;
  labels: XbrlLabel[];
  references: XbrlReference[];
  targetNamespace: string | null;
  substitutionGroup: string | null;

  constructor(data: {
    id: string | null;
    name: string | null;
    type: string | null;
    nillable: boolean;
    targetNamespace: string | null;
    substitutionGroup: string | null;
  }) {
    this.labels = [];
    this.id = data.id;
    this.references = [];
    this.name = data.name;
    this.type = data.type;
    this.nillable = data.nillable;
    this.targetNamespace = data.targetNamespace;
    this.substitutionGroup = data.substitutionGroup;
  }

  addLabel(label: XbrlLabel) {
    this.labels.push(label);
  }

  addReference(reference: XbrlReference) {
    this.references.push(reference);
  }

  getReferencesByRole(...roles: string[]): XbrlReference[] {
    return this.references.filter((reference) => reference.role && roles.includes(reference.role));
  }

  isValid(periodFrom: Date, periodTo: Date): boolean {
    const mandatoryDisclosureReferences = this.getReferencesByRole(
      'http://www.xbrl.org/2003/role/mandatoryDisclosureRef',
      'http://www.xbrl.org/2003/role/reference',
    );

    let isValid = true;

    for (const reference of mandatoryDisclosureReferences) {
      let value = reference.getValue({
        name: ReferenceName.notPermittedFor,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof HgbrefNotPermittedFor) {
        if (value.value === 'Einreichung an Finanzverwaltung') {
          isValid = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.fiscalValidSince,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validSince = value.value;

        if (validSince > periodTo) {
          isValid = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.fiscalValidThrough,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validThrough = value.value;

        if (validThrough < periodFrom) {
          isValid = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.ValidSince,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validSince = value.value;

        if (validSince > periodTo) {
          isValid = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.ValidThrough,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validThrough = value.value;

        if (validThrough < periodFrom) {
          isValid = false;
        }
      }
    }

    return isValid;
  }

  isMandatoryDisclosure(periodFrom: Date, periodTo: Date): boolean {
    const mandatoryDisclosureReferences = this.getReferencesByRole(
      'http://www.xbrl.org/2003/role/mandatoryDisclosureRef',
      'http://www.xbrl.org/2003/role/reference',
    );

    let isRequired = false;
    let isValid = true;

    for (const reference of mandatoryDisclosureReferences) {
      let value = reference.getValue({
        name: ReferenceName.fiscalRequirement,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof HgbrefFiscalRequirement) {
        isRequired = value.isRequired;
        continue;
      }

      value = reference.getValue({
        name: ReferenceName.notPermittedFor,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof HgbrefNotPermittedFor) {
        if (value.value === 'Einreichung an Finanzverwaltung') {
          isRequired = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.fiscalValidSince,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validSince = value.value;

        if (validSince > periodTo) {
          isValid = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.fiscalValidThrough,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validThrough = value.value;

        if (validThrough < periodFrom) {
          isValid = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.ValidSince,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validSince = value.value;

        if (validSince > periodTo) {
          isValid = false;
        }

        continue;
      }

      value = reference.getValue({
        name: ReferenceName.ValidThrough,
        namespace: new XmlNamespace(XmlNamespaces.XbrlHgbref),
      });

      if (value instanceof XsDate) {
        const validThrough = value.value;

        if (validThrough < periodFrom) {
          isValid = false;
        }
      }
    }

    return isRequired && isValid;
  }
}
