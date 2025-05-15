import type { QualifiedName } from '../qualified-name';
import type { XmlAttribute } from './attribute';
import type { XmlNamespaceDeclaration } from './declaration';
import type { XmlNamespace } from './namespace';

export class XmlElement {
  name: string;
  attributes: XmlAttribute[];
  children: (XmlElement | string)[];
  namespace: XmlNamespace | undefined;
  declarations: XmlNamespaceDeclaration[];

  constructor(
    name: string,
    namespace: XmlNamespace | undefined,
    attributes: XmlAttribute[],
    children: (XmlElement | string)[],
    declarations: XmlNamespaceDeclaration[] = [],
  ) {
    this.name = name;
    this.children = children;
    this.namespace = namespace;
    this.attributes = attributes;
    this.declarations = declarations;
  }

  matchesName(name: QualifiedName): boolean {
    if (this.namespace) {
      return this.name === name.name && this.namespace.uri === name.namespace.uri;
    }

    return this.name === name.name;
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

  getNamespace(prefix: string): XmlNamespace | undefined {
    return this.declarations.find((decl) => decl.prefix === prefix)?.namespace;
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
