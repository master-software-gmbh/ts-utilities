import { FindElementVisitor } from '../../visitor/schema/find-element';
import type { QName } from '../qualified-name';
import type { XmlElement } from '../xml/element';
import type { XsAnnotation } from './annotation';
import { XsComplexType } from './complex-type';
import { XsSimpleType } from './simple-type';

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

  targetNamespace?: string;

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

  resolveElement(getGlobalElement: (name: QName) => XsElement | undefined): XsElement {
    if (this.ref) {
      const qname = this.element.resolveQName(this.ref);

      if (qname) {
        const element = getGlobalElement(qname)?.resolveElement(getGlobalElement);

        if (element) {
          return element;
        }
      }
    }

    return this;
  }

  resolveType(
    getGlobalType: (name: QName) => XsSimpleType | XsComplexType | undefined,
    getGlobalElement: (name: QName) => XsElement | undefined,
  ): XsSimpleType | XsComplexType | undefined {
    const resolvedElement = this.resolveElement(getGlobalElement);

    if (resolvedElement.type) {
      const qname = this.element.resolveQName(resolvedElement.type);

      if (qname) {
        return getGlobalType(qname);
      }
    }

    for (const child of this.children) {
      if (child instanceof XsSimpleType || child instanceof XsComplexType) {
        return child;
      }
    }
  }

  findElement(name: string): XsElement | undefined {
    const visitor = new FindElementVisitor(name);
    return visitor.visitElement(this);
  }
}
