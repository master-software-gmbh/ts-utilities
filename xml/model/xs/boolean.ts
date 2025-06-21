import type { XmlElement } from '../xml/element';

export type Children = ['true' | 'false' | '1' | '0'];

export class XsBoolean {
  element: XmlElement;
  children: Children;

  constructor(element: XmlElement, children: Children) {
    this.element = element;
    this.children = children;
  }

  get value(): boolean {
    return this.children[0] === 'true' || this.children[0] === '1';
  }
}
