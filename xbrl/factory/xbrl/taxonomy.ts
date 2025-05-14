import { type Result, error, success, successful } from '../../../result';
import type { LinkLoc } from '../../../xml/model/link/loc';
import type { Dtd } from '../../model/dtd';
import type { XbrlConcept } from '../../model/xbrl/concept';
import { XbrlTaxonomy } from '../../model/xbrl/taxonomy';
import { XbrlTuple } from '../../model/xbrl/tuple';
import { BaseFactory } from './base';
import { XbrlItemFactory } from './item';
import { XbrlLabelFactory } from './label';
import { XbrlReferenceFactory } from './reference';
import { XbrlRoleFactory } from './role';

export class XbrlTaxonomyFactory extends BaseFactory<Dtd, XbrlTaxonomy> {
  private readonly taxonomy = new XbrlTaxonomy();
  private readonly itemFactory = new XbrlItemFactory();
  private readonly roleFactory = new XbrlRoleFactory();
  private readonly labelFactory = new XbrlLabelFactory();
  private readonly referenceFactory = new XbrlReferenceFactory();

  override map(source: Dtd) {
    this.mapElements(source);
    this.mapRoles(source);
    this.mapLabels(source);
    this.mapReferences(source);
    this.mapCalculationLinks(source);

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
            // TODO: map calculation logic
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
    const schemas = source.schema.getSchemas();

    const concepts: XbrlConcept[] = [];

    for (const schema of schemas) {
      const elements = schema.elements;

      for (const element of elements) {
        let result: Result<XbrlConcept, 'validation_failed'>;

        if (element.substitutionGroup === 'xbrli:item') {
          result = this.itemFactory.map(element);
        } else if (element.substitutionGroup === 'xbrli:tuple') {
          result = success(new XbrlTuple(element));
        } else {
          result = error('validation_failed');
        }

        if (result.success) {
          result.data.schema = schema;
          concepts.push(result.data);
        }
      }
    }

    this.taxonomy.concepts = concepts;
  }
}
