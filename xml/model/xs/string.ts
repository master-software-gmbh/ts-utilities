import type { XmlElement } from '../xml/element';

export type Children = [string?];

export class XsString<T extends Array<string | undefined> = Children> {
  element: XmlElement;
  children: T;

  constructor(element: XmlElement, children: T) {
    this.element = element;
    this.children = children;
  }

  get value(): T[0] {
    return this.children[0];
  }
}
