import type { QName } from '../qualified-name';
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

  matchesName(name: QName): boolean {
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

  getNamespaceByPrefix(prefix: string): XmlNamespace | undefined {
    return this.declarations.find((decl) => decl.prefix === prefix)?.namespace;
  }

  resolveQName(name: string): QName | undefined {
    const [prefix, localName] = name.includes(':') ? (name.split(':') as [string, string]) : ['', name];

    const namespace = this.getNamespaceByPrefix(prefix);

    if (namespace) {
      return { name: localName, namespace };
    }
  }
}
