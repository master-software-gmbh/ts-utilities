import { HgbrefFiscalRequirement } from '../../../xml/model/hgbref/fiscal-requirement';
import { ReferenceName } from '../../../xml/model/hgbref/reference-name';
import { XmlNamespaces } from '../../../xml/model/namespaces';
import { XmlNamespace } from '../../../xml/model/xml/namespace';
import type { XbrlConcept } from './concept';
import { XbrlItem } from './item';
import type { XbrlRole } from './role';
import { XbrlTuple } from './tuple';

export class XbrlTaxonomy {
  roles: XbrlRole[] = [];
  concepts: XbrlConcept[] = [];

  get items(): XbrlItem[] {
    return this.concepts.filter((concept) => concept instanceof XbrlItem);
  }

  get tuples(): XbrlTuple[] {
    return this.concepts.filter((concept) => concept instanceof XbrlTuple);
  }

  get requiredConcepts(): XbrlConcept[] {
    return this.concepts.filter((concept) => {
      const mandatoryDisclosureReferences = concept.getReferencesByRole(
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
    });
  }

  getConceptById(id: string): XbrlConcept | undefined {
    return this.concepts.find((concept) => concept.id === id);
  }
}
