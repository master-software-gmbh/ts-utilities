import type { QualifiedName } from '../qualified-name';
import type { XmlElement } from '../xml/element';
import type { XsAnnotation } from './annotation';
import type { XsComplexType } from './complex-type';
import type { XsSimpleType } from './simple-type';

export type Children = (XsAnnotation | XsSimpleType | XsComplexType | unknown)[];

export type Attributes = {
  id?: string;
  ref?: string;
  type?: string;
  name?: string;
  fixed?: string;
  default?: string;
  abstract: boolean;
  minOccurs: number;
  nillable: boolean;
  substitutionGroup?: string;
  maxOccurs: number | 'unbounded';
  form?: 'qualified' | 'unqualified';
  final?: '#all' | ('extension' | 'restriction')[];
  block?: '#all' | ('extension' | 'restriction' | 'substitution')[];
};

export class XsElement {
  id?: string;
  ref?: string;
  type?: string;
  name?: string;
  fixed?: string;
  default?: string;
  abstract: boolean;
  minOccurs: number;
  nillable: boolean;
  children: Children;
  element: XmlElement;
  substitutionGroup?: string;
  maxOccurs: number | 'unbounded';
  form?: 'qualified' | 'unqualified';
  final?: '#all' | ('extension' | 'restriction')[];
  block?: '#all' | ('extension' | 'restriction' | 'substitution')[];

  getName(): string | undefined {
    if (this.ref) {
      const qualifiedName = this.getQualifiedName(this.ref);

      if (qualifiedName) {
        return qualifiedName.name;
      }
    }

    return this.name;
  }

  getResolvedType(
    getGlobalType: (name: QualifiedName) => XsSimpleType | XsComplexType | undefined,
    getGlobalElement: (name: QualifiedName) => XsElement | undefined,
  ): XsSimpleType | XsComplexType | undefined {
    let type: XsSimpleType | XsComplexType | undefined;

    if (this.type) {
      // Resolve qualified name of global type

      const qualifiedName = this.getQualifiedName(this.type);

      if (qualifiedName) {
        type = getGlobalType(qualifiedName);
      }
    } else if (this.ref) {
      // Resolve qualified name of global element

      const qualifiedName = this.getQualifiedName(this.ref);

      if (qualifiedName) {
        const element = getGlobalElement(qualifiedName);

        if (element) {
          type = element.getResolvedType(getGlobalType, getGlobalElement);
        }
      }
    }

    return type;
  }

  getQualifiedName(from: string): QualifiedName | undefined {
    const [prefix, name] = from.includes(':') ? (from.split(':') as [string, string]) : ['', from];
    const namespace = this.element.getNamespace(prefix);

    if (namespace) {
      return { name, namespace };
    }
  }

  constructor(element: XmlElement, children: Children, attributes: Attributes) {
    this.element = element;
    this.children = children;
    this.id = attributes.id;
    this.ref = attributes.ref;
    this.type = attributes.type;
    this.name = attributes.name;
    this.form = attributes.form;
    this.final = attributes.final;
    this.block = attributes.block;
    this.fixed = attributes.fixed;
    this.default = attributes.default;
    this.abstract = attributes.abstract;
    this.nillable = attributes.nillable;
    this.minOccurs = attributes.minOccurs;
    this.maxOccurs = attributes.maxOccurs;
    this.substitutionGroup = attributes.substitutionGroup;
  }
}
