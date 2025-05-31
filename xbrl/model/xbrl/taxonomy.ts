import type { XbrlCalculationLink } from './calculation-link';
import type { XbrlConcept } from './concept';
import type { XbrlPresentationLink } from './presentation-link';
import type { XbrlRole } from './role';

export class XbrlTaxonomy {
  roles: XbrlRole[];
  concepts: XbrlConcept[];
  calculationLinks: XbrlCalculationLink[];
  presentationLinks: XbrlPresentationLink[];

  constructor() {
    this.roles = [];
    this.concepts = [];
    this.calculationLinks = [];
    this.presentationLinks = [];
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

  getMandatoryConceptsInPresentationNetwork(...roles: string[]): XbrlConcept[] {
    const network = this.presentationNetwork;

    return this.concepts.filter((concept) => {
      if (!concept.id) {
        return false;
      }

      for (const role of roles) {
        const conceptsInNetwork = network.get(role);

        if (conceptsInNetwork?.includes(concept.id)) {
          return concept.isMandatoryDisclosure;
        }
      }

      return false;
    });
  }
}
