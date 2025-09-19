import { type Result, error, success, successful } from '../../../result';
import type { LinkLoc } from '../../../xml/model/link/loc';
import type { Dtd } from '../../model/dtd';
import { XbrlCalculationLink } from '../../model/xbrl/calculation-link';
import type { XbrlConcept } from '../../model/xbrl/concept';
import { XbrlPresentationLink } from '../../model/xbrl/presentation-link';
import { XbrlTaxonomy } from '../../model/xbrl/taxonomy';
import { XbrlTuple } from '../../model/xbrl/tuple';
import { BaseFactory } from './base';
import { XbrlItemFactory } from './item';
import { XbrlLabelFactory } from './label';
import { XbrlReferenceFactory } from './reference';
import { XbrlRoleFactory } from './role';

export class XbrlTaxonomyFactory extends BaseFactory<Dtd, XbrlTaxonomy> {
  private readonly taxonomy: XbrlTaxonomy;
  private readonly itemFactory = new XbrlItemFactory();
  private readonly roleFactory = new XbrlRoleFactory();
  private readonly labelFactory = new XbrlLabelFactory();
  private readonly referenceFactory = new XbrlReferenceFactory();

  constructor(source: Dtd) {
    super();
    this.taxonomy = new XbrlTaxonomy(source);
  }

  override map() {
    this.mapElements(this.taxonomy.dtd);
    this.mapRoles(this.taxonomy.dtd);
    this.mapLabels(this.taxonomy.dtd);
    this.mapReferences(this.taxonomy.dtd);
    this.mapCalculationLinks(this.taxonomy.dtd);
    this.mapPresentationLinks(this.taxonomy.dtd);

    return success(this.taxonomy);
  }

  private mapReferences(source: Dtd) {
    for (const link of source.referenceLinks) {
      const locs = link.locs;
      const references = link.references;
      const referenceArcs = link.referenceArcs;

      for (const arc of referenceArcs) {
        // arc from --> loc reference
        const loc = locs.find((loc) => arc.from === loc.label);

        // arc to --> reference reference
        const linkReference = references.find((reference) => arc.to === reference.label);

        if (loc && linkReference) {
          const concept = this.getConceptFromLoc(loc);
          const { data: reference } = this.referenceFactory.map(linkReference);

          if (concept && reference) {
            concept.addReference(reference);
          }
        }
      }
    }
  }

  private mapLabels(source: Dtd) {
    for (const link of source.labelLinks) {
      const locs = link.locs;
      const labels = link.labels;
      const labelArcs = link.labelArcs;

      for (const arc of labelArcs) {
        // arc from --> loc label
        const loc = locs.find((loc) => arc.from === loc.label);

        // arc to --> label label
        const linkLabel = labels.find((label) => arc.to === label.label);

        if (loc && linkLabel) {
          const concept = this.getConceptFromLoc(loc);
          const { data: label } = this.labelFactory.map(linkLabel);

          if (concept && label) {
            concept.addLabel(label);
          }
        }
      }
    }
  }

  private mapCalculationLinks(source: Dtd) {
    for (const link of source.calculationLinks) {
      const locs = link.locs;
      const arcs = link.calculationArcs;

      for (const arc of arcs) {
        // arc from --> loc label
        const fromLoc = locs.find((loc) => arc.from === loc.label);

        // arc to --> loc label
        const toLoc = locs.find((loc) => arc.to === loc.label);

        if (fromLoc && toLoc) {
          const fromConcept = this.getConceptFromLoc(fromLoc);
          const toConcept = this.getConceptFromLoc(toLoc);

          if (fromConcept && toConcept) {
            const relation = new XbrlCalculationLink(fromConcept, toConcept, arc.weight, link.role);
            this.taxonomy.calculationLinks.push(relation);
          }
        }
      }
    }
  }

  private mapPresentationLinks(source: Dtd) {
    for (const link of source.presentationLinks) {
      const locs = link.locs;
      const arcs = link.presentationArcs;

      for (const arc of arcs) {
        // arc from --> loc label
        const fromLoc = locs.find((loc) => arc.from === loc.label);

        // arc to --> loc label
        const toLoc = locs.find((loc) => arc.to === loc.label);

        if (fromLoc && toLoc) {
          const fromConcept = this.getConceptFromLoc(fromLoc);
          const toConcept = this.getConceptFromLoc(toLoc);

          if (fromConcept && toConcept) {
            const relation = new XbrlPresentationLink(fromConcept, toConcept, link.role);
            this.taxonomy.presentationLinks.push(relation);
          }
        }
      }
    }
  }

  private getConceptFromLoc(loc: LinkLoc): XbrlConcept | undefined {
    const [base, fragment] = loc.href.split('#');

    if (base && fragment) {
      return this.taxonomy.getConceptById(fragment);
    }
  }

  private mapRoles(source: Dtd) {
    const results = source.roleTypes.map((type) => this.roleFactory.map(type));
    this.taxonomy.roles = successful(results);
  }

  private mapElements(source: Dtd) {
    const concepts: XbrlConcept[] = [];

    const elements = source.schema.getElements();

    for (const element of elements) {
      let result: Result<XbrlConcept, 'validation_failed'> = error('validation_failed');

      if (element.substitutionGroup === 'xbrli:item') {
        result = this.itemFactory.map(element);
      } else if (element.substitutionGroup === 'xbrli:tuple') {
        result = success(new XbrlTuple({
          id: element.id ?? null,
          name: element.name ?? null,
          type: element.type ?? null,
          nillable: element.nillable,
          targetNamespace: element.targetNamespace ?? null,
          substitutionGroup: element.substitutionGroup ?? null,
        }));
      } else if (element.substitutionGroup) {
        // Assume it's a substitution group for items
        result = this.itemFactory.map(element);
      }

      if (result.success) {
        concepts.push(result.data);
      }
    }

    this.taxonomy.concepts = concepts;
  }
}
