import type { LinkCalculationLink } from '../../xml/model/link/calculation-link';
import type { LinkLabelLink } from '../../xml/model/link/label-link';
import type { LinkLinkbase } from '../../xml/model/link/linkbase';
import type { LinkPresentationLink } from '../../xml/model/link/presentation-link';
import type { LinkReferenceLink } from '../../xml/model/link/reference-link';
import type { LinkRoleType } from '../../xml/model/link/role-type';
import type { NormalizedSchema } from '../../xml/normalizer/normalized-schema';

/**
 * Discoverable Taxonomy Set (DTD)
 * Contains a collection of XML Schemas and Linkbases.
 */
export class Dtd {
  schema: NormalizedSchema;
  linkbases: LinkLinkbase[];

  constructor(schema: NormalizedSchema, linkbases: LinkLinkbase[]) {
    this.schema = schema;
    this.linkbases = linkbases;
  }

  get roleTypes(): LinkRoleType[] {
    return this.schema.allRoleTypes;
  }

  get labelLinks(): LinkLabelLink[] {
    return this.linkbases.flatMap((linkbase) => linkbase.labelLinks);
  }

  get referenceLinks(): LinkReferenceLink[] {
    return this.linkbases.flatMap((linkbase) => linkbase.referenceLinks);
  }

  get calculationLinks(): LinkCalculationLink[] {
    return this.linkbases.flatMap((linkbase) => linkbase.calculationLinks);
  }

  get presentationLinks(): LinkPresentationLink[] {
    return this.linkbases.flatMap((linkbase) => linkbase.presentationLinks);
  }
}
