import type { LinkCalculationLink } from '../../xml/model/link/calculation-link';
import type { LinkLabelLink } from '../../xml/model/link/label-link';
import type { LinkLinkbase } from '../../xml/model/link/linkbase';
import type { LinkReferenceLink } from '../../xml/model/link/reference-link';
import { LinkRoleType } from '../../xml/model/link/role-type';
import type { NormalizedSchemaSet } from '../../xml/normalizer/schema-set';

/**
 * Discoverable Taxonomy Set (DTD)
 * Contains a collection of XML Schemas and Linkbases.
 */
export class Dtd {
  schema: NormalizedSchemaSet;
  linkbases: LinkLinkbase[];

  constructor(schema: NormalizedSchemaSet, linkbases: LinkLinkbase[]) {
    this.schema = schema;
    this.linkbases = linkbases;
  }

  get roleTypes(): LinkRoleType[] {
    return this.schema.getNestedChildren((schema) =>
      schema.annotations.flatMap((annotation) =>
        annotation.appinfos.flatMap((appinfo) => appinfo.getChildren(LinkRoleType)),
      ),
    );
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
}
