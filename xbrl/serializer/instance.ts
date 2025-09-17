import { XmlNamespaces } from '../../xml/model/namespaces';
import { XmlAttribute } from '../../xml/model/xml/attribute';
import { XmlNamespaceDeclaration } from '../../xml/model/xml/declaration';
import { XmlDocument } from '../../xml/model/xml/document';
import { XmlElement } from '../../xml/model/xml/element';
import { XmlNamespace } from '../../xml/model/xml/namespace';
import { XbrldiExplicitMember } from '../model/xbrldi/explicit-member';
import type { XbrlContext } from '../model/xbrli/context';
import type { XbrlEntity } from '../model/xbrli/entity';
import type { XbrlFact } from '../model/xbrli/fact';
import type { XbrlIdentifier } from '../model/xbrli/identifier';
import type { XbrlInstance } from '../model/xbrli/instance';
import type { XbrlMeasure } from '../model/xbrli/measure';
import type { XbrlPeriod } from '../model/xbrli/period';
import type { XbrlScenario } from '../model/xbrli/scenario';
import type { LinkSchemaRef } from '../model/xbrli/schema-ref';
import type { XbrlUnit } from '../model/xbrli/unit';

export class XbrlInstanceSerializer {
  private readonly linkNamespace = new XmlNamespace(XmlNamespaces.XbrlLinkbase);
  private readonly xlinkNamespace = new XmlNamespace(XmlNamespaces.XmlLinking);
  private readonly xbrliNamespace = new XmlNamespace(XmlNamespaces.XbrlInstance);
  private readonly xbrldiNamespace = new XmlNamespace(XmlNamespaces.XbrlDimensions);
  private readonly xsiNamespace = new XmlNamespace(XmlNamespaces.XmlSchemaInstance);

  serialize(instance: XbrlInstance): XmlDocument {
    const rootElement = this.serializeInstance(instance);
    return new XmlDocument(rootElement);
  }

  private serializeInstance(instance: XbrlInstance): XmlElement {
    const attributes: XmlAttribute[] = [];
    const children: (string | XmlElement)[] = [];
    const declarations: XmlNamespaceDeclaration[] = [
      new XmlNamespaceDeclaration('xsi', this.xsiNamespace),
      new XmlNamespaceDeclaration('xbrli', this.xbrliNamespace),
      new XmlNamespaceDeclaration('de-gaap-ci', new XmlNamespace(XmlNamespaces.XbrlGaap)),
    ];

    const element = new XmlElement('xbrl', this.xbrliNamespace, attributes, children, declarations);

    for (const unit of instance.units) {
      const unitElement = this.serializeUnit(unit);
      children.push(unitElement);
    }

    for (const context of instance.contexts) {
      const contextElement = this.serializeContext(context);
      children.push(contextElement);
    }

    for (const fact of instance.facts) {
      const factElement = this.serializeFact(fact);

      if (factElement) {
        children.push(factElement);
      }
    }

    return element;
  }

  serializeUnit(unit: XbrlUnit): XmlElement {
    const attributes: XmlAttribute[] = [new XmlAttribute('id', unit.id)];
    const children: (string | XmlElement)[] = unit.measures.map((measure) => this.serializeMeasure(measure));

    return new XmlElement('unit', this.xbrliNamespace, attributes, children);
  }

  serializeMeasure(measure: XbrlMeasure): XmlElement {
    const attributes: XmlAttribute[] = [];
    const children: (string | XmlElement)[] = [measure.value];

    return new XmlElement('measure', this.xbrliNamespace, attributes, children);
  }

  serializeContext(context: XbrlContext): XmlElement {
    const attributes: XmlAttribute[] = [new XmlAttribute('id', context.id)];

    const children: (string | XmlElement)[] = [
      this.serializeEntity(context.entity),
      this.serializePeriod(context.period),
    ];

    if (context.scenario) {
      children.push(this.serializeScenario(context.scenario));
    }

    return new XmlElement('context', this.xbrliNamespace, attributes, children);
  }

  serializeSchemaRef(schemaRef: LinkSchemaRef): XmlElement {
    const attributes: XmlAttribute[] = [
      new XmlAttribute('type', 'simple', this.xlinkNamespace),
      new XmlAttribute('href', schemaRef.href, this.xlinkNamespace),
    ];

    return new XmlElement('schemaRef', this.linkNamespace, attributes, []);
  }

  private serializeEntity(entity: XbrlEntity): XmlElement {
    const children: (string | XmlElement)[] = [this.serializeIdentifier(entity.identifier)];
    return new XmlElement('entity', this.xbrliNamespace, [], children);
  }

  private serializeIdentifier(identifier: XbrlIdentifier): XmlElement {
    return new XmlElement(
      'identifier',
      this.xbrliNamespace,
      [new XmlAttribute('scheme', identifier.scheme)],
      [identifier.value],
    );
  }

  private serializePeriod(period: XbrlPeriod): XmlElement {
    const children: (string | XmlElement)[] = [];

    if (typeof period.value === 'string') {
      children.push(new XmlElement('instant', this.xbrliNamespace, [], [period.value]));
    } else {
      children.push(new XmlElement('startDate', this.xbrliNamespace, [], [period.value.startDate]));
      children.push(new XmlElement('endDate', this.xbrliNamespace, [], [period.value.endDate]));
    }

    return new XmlElement('period', this.xbrliNamespace, [], children);
  }

  private serializeScenario(scenario: XbrlScenario): XmlElement {
    const attributes: XmlAttribute[] = [];
    const children: (string | XmlElement)[] = scenario.value.compactMap((child) => {
      if (child instanceof XbrldiExplicitMember) {
        return this.serializeExplicitMember(child);
      }

      return null;
    });

    return new XmlElement('scenario', this.xbrliNamespace, attributes, children);
  }

  private serializeExplicitMember(member: XbrldiExplicitMember): XmlElement {
    return new XmlElement(
      'explicitMember',
      this.xbrldiNamespace,
      [new XmlAttribute('dimension', member.dimension)],
      [member.member],
    );
  }

  serializeFact(fact: XbrlFact): XmlElement {
    const attributes: XmlAttribute[] = [];
    const children: (string | XmlElement)[] = fact.value.map((value) => {
      if (typeof value === 'string') {
        return value;
      }

      return this.serializeFact(value);
    });

    if (fact.nil) {
      attributes.push(new XmlAttribute('nil', 'true', this.xsiNamespace));
    }

    if (fact.unit) {
      attributes.push(new XmlAttribute('unitRef', fact.unit.id));
    }

    if (fact.context) {
      attributes.push(new XmlAttribute('contextRef', fact.context.id));
    }

    if (fact.decimals) {
      attributes.push(new XmlAttribute('decimals', fact.decimals.toString()));
    }

    if (fact.concept.name) {
      const targetNamespace = fact.concept.targetNamespace;

      if (targetNamespace) {
        return new XmlElement(fact.concept.name, new XmlNamespace(targetNamespace), attributes, children);
      }

      throw new Error(`Concept ${fact.concept.name} has no target namespace`);
    }

    throw new Error(`Concept ${fact.concept.name} has no name`);
  }
}
