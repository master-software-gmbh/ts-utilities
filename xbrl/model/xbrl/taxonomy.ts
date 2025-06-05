import { XmlNamespace, XsElement } from '../../../xml';
import type { QName } from '../../../xml/model/qualified-name';
import type { XsChoice } from '../../../xml/model/xs/choice';
import type { Dtd } from '../dtd';
import type { XbrlCalculationLink } from './calculation-link';
import type { XbrlConcept } from './concept';
import type { XbrlPresentationLink } from './presentation-link';
import type { XbrlRole } from './role';

export class XbrlTaxonomy {
  dtd: Dtd;
  roles: XbrlRole[];
  concepts: XbrlConcept[];
  calculationLinks: XbrlCalculationLink[];
  presentationLinks: XbrlPresentationLink[];

  constructor(dtd: Dtd) {
    this.dtd = dtd;
    this.roles = [];
    this.concepts = [];
    this.calculationLinks = [];
    this.presentationLinks = [];
  }

  getChoiceOptions(element: XsChoice): XsElement[] {
    const options: XsElement[] = [];

    for (const child of element.children) {
      if (child instanceof XsElement) {
        const resolvedElement = child.resolveElement((name) => this.dtd.schema.getElement(name));

        if (!resolvedElement.name || !resolvedElement.targetNamespace) {
          continue;
        }

        const targetNamespace = new XmlNamespace(resolvedElement.targetNamespace);

        const qname: QName = {
          name: resolvedElement.name,
          namespace: targetNamespace,
        };

        const substitutions = this.dtd.schema.getSubstitutionGroup(qname);
        options.push(...substitutions);
      }
    }

    return options;
  }

  getConceptById(id: string): XbrlConcept | undefined {
    return this.concepts.find((concept) => concept.id === id);
  }

  getCalculationRelations(...roles: string[]): XbrlCalculationLink[] {
    return this.calculationLinks.filter((relation) => roles.includes(relation.role));
  }

  private get presentationNetwork(): Map<string, string[]> {
    const network = new Map<string, string[]>();

    for (const link of this.presentationLinks) {
      if (!link.from.id || !link.to.id) {
        continue;
      }

      const list = network.get(link.role) ?? [];

      list.push(link.from.id, link.to.id);

      network.set(link.role, list);
    }

    return network;
  }

  getMandatoryConceptsInPresentationNetwork(periodFrom: Date, periodTo: Date, ...roles: string[]): XbrlConcept[] {
    const network = this.presentationNetwork;

    return this.concepts.filter((concept) => {
      if (!concept.id) {
        return false;
      }

      for (const role of roles) {
        const conceptsInNetwork = network.get(role);

        if (conceptsInNetwork?.includes(concept.id)) {
          return concept.isMandatoryDisclosure(periodFrom, periodTo);
        }
      }

      return false;
    });
  }
}
