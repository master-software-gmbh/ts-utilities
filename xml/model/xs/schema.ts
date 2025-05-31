import { ofInstance } from '../../../class';
import type { XmlElement } from '../xml/element';
import { XsAnnotation } from './annotation';
import { XsComplexType } from './complex-type';
import { XsElement } from './element';
import { XsImport } from './import';
import { XsInclude } from './include';
import { XsSimpleType } from './simple-type';

export type Children = (XsAnnotation | unknown)[];

export type Attributes = {
  id?: string;
  version?: string;
  targetNamespace?: string;
  elementFormDefault: 'qualified' | 'unqualified';
  attributeFormDefault: 'qualified' | 'unqualified';
  blockDefault: '#all' | ('extension' | 'restriction' | 'substitution')[];
  finalDefault: '#all' | ('extension' | 'restriction' | 'list' | 'union')[];
};

export class XsSchema {
  id?: string;
  version?: string;
  children: Children;
  element: XmlElement;
  targetNamespace?: string;
  elementFormDefault: 'qualified' | 'unqualified';
  attributeFormDefault: 'qualified' | 'unqualified';
  blockDefault: '#all' | ('extension' | 'restriction' | 'substitution')[];
  finalDefault: '#all' | ('extension' | 'restriction' | 'list' | 'union')[];

  constructor(element: XmlElement, children: Children, attributes: Attributes) {
    this.element = element;
    this.id = attributes.id;
    this.children = children;
    this.version = attributes.version;
    this.blockDefault = attributes.blockDefault;
    this.finalDefault = attributes.finalDefault;
    this.targetNamespace = attributes.targetNamespace;
    this.elementFormDefault = attributes.elementFormDefault;
    this.attributeFormDefault = attributes.attributeFormDefault;
  }

  get annotations(): XsAnnotation[] {
    return ofInstance(this.children, XsAnnotation);
  }

  get imports(): XsImport[] {
    return ofInstance(this.children, XsImport);
  }

  get includes(): XsInclude[] {
    return ofInstance(this.children, XsInclude);
  }

  get elements(): XsElement[] {
    return ofInstance(this.children, XsElement);
  }

  get simpleTypes(): XsSimpleType[] {
    return ofInstance(this.children, XsSimpleType);
  }

  get complexTypes(): XsComplexType[] {
    return ofInstance(this.children, XsComplexType);
  }
}
