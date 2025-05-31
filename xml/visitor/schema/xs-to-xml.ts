import { logger } from '../../../logging';
import { XmlElementFactory } from '../../factory/xml/element';
import type { QName } from '../../model/qualified-name';
import { XmlAttribute } from '../../model/xml/attribute';
import type { XmlNamespaceDeclaration } from '../../model/xml/declaration';
import type { XmlElement } from '../../model/xml/element';
import { XmlNamespace } from '../../model/xml/namespace';
import { XsAttribute } from '../../model/xs/attribute';
import { XsAttributeGroup } from '../../model/xs/attribute-group';
import { XsChoice } from '../../model/xs/choice';
import { XsComplexType } from '../../model/xs/complex-type';
import { XsElement } from '../../model/xs/element';
import { XsExtension } from '../../model/xs/extension';
import { XsSequence } from '../../model/xs/sequence';
import { XsSimpleContent } from '../../model/xs/simple-content';
import { XsSimpleType } from '../../model/xs/simple-type';
import type { NormalizedSchema } from '../../normalizer/normalized-schema';

type ElementContext = {
  getDeclarations?: () => XmlNamespaceDeclaration[];
  getAttribute: (name: string) => string | undefined;
  getChildren: () => (string | XmlElement)[];
};

export type Context = (path: string[]) => ElementContext[];

export class XmlSchemaToXmlVisitor {
  private readonly getContext: Context;
  private readonly schema: NormalizedSchema;

  constructor(schema: NormalizedSchema, context: Context) {
    this.schema = schema;
    this.getContext = context;
  }

  processElement(element: XsElement, path: string[] = []): XmlElement[] {
    // Resolve the element (ref only)
    const resolvedElement = element.resolveElement(this.getGlobalElement.bind(this));

    if (!resolvedElement.name) {
      throw new Error(`Resolved element ${element.name} has no name.`);
    }

    // Get the qualified name of the element
    if (!resolvedElement.targetNamespace) {
      throw new Error(`Element ${resolvedElement.name} has no target namespace.`);
    }

    const targetNamespace = new XmlNamespace(resolvedElement.targetNamespace);

    const qname: QName = {
      name: resolvedElement.name,
      namespace: targetNamespace,
    };

    if (resolvedElement.abstract) {
      // Retrieve substitutions and insert them in place

      const group = this.schema.getSubstitutionGroup(qname);
      const substitutions = group.flatMap((e) => this.processElement(e, [...path]));

      return substitutions;
    }

    // Update the path with the current element's name
    path.push(resolvedElement.name);

    const contexts = this.getContext(path);
    const results: XmlElement[] = [];

    // Resolve the type of the element
    const type = resolvedElement.resolveType(this.getGlobalType.bind(this), this.getGlobalElement.bind(this));

    if (type) {
      for (const context of contexts) {
        const factory = new XmlElementFactory(resolvedElement.name, targetNamespace);
        this.processType(type, factory, path, context);

        // Handle explicit namespace declarations
        const declarations = context.getDeclarations?.() ?? [];

        factory.addDeclarations(...declarations);

        if (!factory.isEmpty) {
          results.push(factory.create());
        }
      }
    }

    return results;
  }

  private getGlobalElement(name: QName): XsElement | undefined {
    return this.schema.getElement(name);
  }

  private getGlobalType(name: QName): XsSimpleType | XsComplexType | undefined {
    return this.schema.getType(name);
  }

  private processType(type: unknown, factory: XmlElementFactory, path: string[], context: ElementContext): void {
    if (type instanceof XsSimpleType) {
      this.processSimpleType(type, factory, path, context);
    } else if (type instanceof XsComplexType) {
      this.processComplexType(type, factory, path, context);
    } else if (type instanceof XsSequence) {
      this.processSequence(type, factory, path, context);
    } else if (type instanceof XsChoice) {
      this.processChoice(type, factory, path, context);
    } else if (type instanceof XsElement) {
      factory.addChildren(...this.processElement(type, [...path]));
    }
  }

  private processSimpleType(
    type: XsSimpleType,
    factory: XmlElementFactory,
    _path: string[],
    context?: ElementContext,
  ): void {
    // If it's a simple type, retrieve a value from the context

    if (!context) {
      throw new Error(`No context found for simple type ${type.name}`);
    }

    factory.addChildren(...context.getChildren());
  }

  private processComplexType(
    type: XsComplexType,
    factory: XmlElementFactory,
    path: string[],
    context: ElementContext,
  ): void {
    // If the context provides children, add them to the factory

    const children = context.getChildren();
    factory.addChildren(...children);

    // If it's a complex type, retrieve the content from it's children

    for (const child of type.children) {
      if (child instanceof XsSequence) {
        this.processSequence(child, factory, path, context);
      } else if (child instanceof XsChoice) {
        this.processChoice(child, factory, path, context);
      } else if (child instanceof XsAttribute) {
        this.processAttribute(child, factory, path, context);
      } else if (child instanceof XsSimpleContent) {
        this.processSimpleContent(child, factory, path, context);
      }
    }
  }

  private processSequence(
    sequence: XsSequence,
    factory: XmlElementFactory,
    path: string[],
    context: ElementContext,
  ): void {
    for (const child of sequence.children) {
      this.processType(child, factory, path, context);
    }
  }

  private processChoice(choice: XsChoice, factory: XmlElementFactory, path: string[], context: ElementContext): void {
    for (const child of choice.children) {
      this.processType(child, factory, path, context);
    }
  }

  private processAttribute(
    attribute: XsAttribute,
    factory: XmlElementFactory,
    _path: string[],
    context: ElementContext,
  ): void {
    if (attribute.ref) {
      throw new Error(`Attribute ${attribute.name} has a reference, which is not supported.`);
    }

    if (!attribute.name) {
      throw new Error('Attribute in complex type has no name.');
    }

    if (attribute.fixed) {
      factory.addAttributes(new XmlAttribute(attribute.name, attribute.fixed));
    }

    if (!context) {
      throw new Error(`No context found for attribute ${attribute.name}`);
    }

    const value = context.getAttribute(attribute.name);

    if (value) {
      factory.addAttributes(new XmlAttribute(attribute.name, value));
    }
  }

  private processSimpleContent(
    simpleContent: XsSimpleContent,
    factory: XmlElementFactory,
    path: string[],
    context: ElementContext,
  ): void {
    for (let child of simpleContent.children) {
      if (child instanceof XsExtension) {
        if (child.base) {
          // Process the extended base type
          const qname = child.element.resolveQName(child.base);

          if (qname) {
            const type = this.getGlobalType(qname);

            if (type) {
              this.processType(type, factory, path, context);
            } else {
              logger.warn('Resolved base type not found', {
                qname: qname,
                base: child.base,
              });
            }
          } else {
            throw new Error(`Base type ${child.base} could not be resolved in simple content`);
          }
        }

        // Process additional attributes
        for (child of child.children) {
          if (child instanceof XsAttribute) {
            this.processAttribute(child, factory, path, context);
          } else if (child instanceof XsAttributeGroup) {
            throw new Error(`Attribute group ${child.name} is not supported in simple content`);
          }
        }
      }
    }
  }
}
