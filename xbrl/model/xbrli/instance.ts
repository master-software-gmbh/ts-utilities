import { XmlNamespace } from '../../../xml';
import { XmlNamespaces } from '../../../xml/model/namespaces';
import type { Context } from '../../../xml/visitor/schema/xs-to-xml';
import { XbrlInstanceSerializer } from '../../serializer/instance';
import type { XbrlContext } from './context';
import type { XbrlFact } from './fact';
import type { LinkSchemaRef } from './schema-ref';
import type { XbrlUnit } from './unit';

export class XbrlInstance {
  readonly schemaRefs: LinkSchemaRef[];
  private readonly factsMap: Map<string, XbrlFact>;
  private readonly unitsMap: Map<string, XbrlUnit>;
  private readonly contextsMap: Map<string, XbrlContext>;

  constructor() {
    this.schemaRefs = [];
    this.factsMap = new Map();
    this.unitsMap = new Map();
    this.contextsMap = new Map();
  }

  get facts(): XbrlFact[] {
    return Array.from(this.factsMap.values());
  }

  get units(): XbrlUnit[] {
    return Array.from(this.unitsMap.values());
  }

  get contexts(): XbrlContext[] {
    return Array.from(this.contextsMap.values());
  }

  private hasFact(id: string): boolean {
    return this.factsMap.has(id);
  }

  getFact(id: string): XbrlFact | undefined {
    return this.factsMap.get(id);
  }

  addSchemaRef(schemaRef: LinkSchemaRef): void {
    this.schemaRefs.push(schemaRef);
  }

  addFact(fact: XbrlFact): void {
    if (!fact.concept.id) {
      throw new Error('Fact must have a concept with an ID.');
    }

    if (this.hasFact(fact.concept.id)) {
      throw new Error(`Fact with ID ${fact.concept.id} already exists in the instance.`);
    }

    this.factsMap.set(fact.concept.id, fact);
  }

  addUnit(unit: XbrlUnit): void {
    if (this.unitsMap.has(unit.id)) {
      throw new Error(`Unit with ID ${unit.id} already exists in the instance.`);
    }

    this.unitsMap.set(unit.id, unit);
  }

  addContext(context: XbrlContext): void {
    if (this.contextsMap.has(context.id)) {
      throw new Error(`Context with ID ${context.id} already exists in the instance.`);
    }

    this.contextsMap.set(context.id, context);
  }

  getContext(): Context {
    const serializer = new XbrlInstanceSerializer();

    return (path) => {
      const name = path[path.length - 1];

      switch (name) {
        case 'xbrl':
          return [
            {
              getDeclarations() {
                return [
                  {
                    namespace: new XmlNamespace(XmlNamespaces.XbrlDeGaapCi),
                    prefix: 'de-gaap-ci',
                  },
                  {
                    namespace: new XmlNamespace(XmlNamespaces.XbrlDeGcd),
                    prefix: 'de-gcd',
                  },
                  {
                    namespace: new XmlNamespace(XmlNamespaces.XbrlLinkbase),
                    prefix: 'link',
                  },
                  {
                    namespace: new XmlNamespace(XmlNamespaces.XbrlInstance),
                    prefix: 'xbrli',
                  },
                  {
                    namespace: new XmlNamespace(XmlNamespaces.XbrlIso4217),
                    prefix: 'iso4217',
                  },
                  {
                    namespace: new XmlNamespace(XmlNamespaces.XmlLinking),
                    prefix: 'xlink',
                  },
                  {
                    namespace: new XmlNamespace(XmlNamespaces.XmlSchemaInstance),
                    prefix: 'xsi',
                  },
                ];
              },
              getAttribute(_) {
                return undefined;
              },
              getChildren: () => {
                return [
                  ...this.schemaRefs.map((ref) => serializer.serializeSchemaRef(ref)),
                  ...this.contexts.map((context) => serializer.serializeContext(context)),
                  ...this.units.map((unit) => serializer.serializeUnit(unit)),
                  ...this.facts.map((fact) => serializer.serializeFact(fact)),
                ];
              },
            },
          ];
      }

      return [];
    };
  }
}
