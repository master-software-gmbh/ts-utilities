import type { XmlAttribute } from './attribute';
import type { XmlNamespace } from './namespace';

export class XmlElement {
  name: string;
  attributes: XmlAttribute[];
  namespace: XmlNamespace | null;
  children: (XmlElement | string)[];

  constructor(
    name: string,
    namespace: XmlNamespace | null,
    attributes: XmlAttribute[],
    children: (XmlElement | string)[],
  ) {
    this.name = name;
    this.children = children;
    this.namespace = namespace;
    this.attributes = attributes;
  }

  getAttributes(): Record<string, string> {
    return Object.fromEntries(this.attributes.map(({ name, value }) => [name, value]));
  }

  getAttribute(name: string, namespace?: string): XmlAttribute | undefined {
    return this.attributes.find((attr) => {
      if (attr.namespace) {
        return attr.name === name && attr.namespace.uri === namespace;
      }

      return attr.name === name;
    });
  }

  toString(): string {
    const namespaceString = this.namespace ? ` xmlns="${this.namespace.uri}"` : '';
    const attributesString = this.attributes.map((attr) => `${attr.name}="${attr.value}"`).join(' ');

    const childrenString = this.children
      .map((child) => (typeof child === 'string' ? child : child.toString()))
      .join('\n');

    return `<${this.name}${namespaceString} ${attributesString}>${childrenString}</${this.name}>`;
  }
}
