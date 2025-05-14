import type { XmlElement } from '../xml/element';
import type { XsAnnotation } from './annotation';
import type { XsAnyAttribute } from './any-attribute';
import type { XsAttribute } from './attribute';
import type { XsAttributeGroup } from './attribute-group';
import type { XsChoice } from './choice';
import type { XsComplexContent } from './complex-content';
import type { XsSequence } from './sequence';
import type { XsSimpleContent } from './simple-content';

export type Children = (
  | XsAnnotation
  | XsSimpleContent
  | XsComplexContent
  | XsChoice
  | XsSequence
  | XsAttribute
  | XsAttributeGroup
  | XsAnyAttribute
  | unknown
)[];

export type Attributes = {
  id?: string;
  name?: string;
  mixed: boolean;
  abstract: boolean;
  block?: '#all' | ('extension' | 'restriction')[];
  final?: '#all' | ('extension' | 'restriction')[];
};

export class XsComplexType {
  id?: string;
  name?: string;
  mixed: boolean;
  abstract: boolean;
  element: XmlElement;
  children: Children;
  block?: '#all' | ('extension' | 'restriction')[];
  final?: '#all' | ('extension' | 'restriction')[];

  constructor(element: XmlElement, children: Children, attributes: Attributes) {
    this.element = element;
    this.id = attributes.id;
    this.children = children;
    this.name = attributes.name;
    this.mixed = attributes.mixed;
    this.block = attributes.block;
    this.final = attributes.final;
    this.abstract = attributes.abstract;
  }
}
