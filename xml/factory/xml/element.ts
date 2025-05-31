import type { XmlAttribute } from '../../model/xml/attribute';
import { XmlElement } from '../../model/xml/element';
import type { XmlNamespace } from '../../model/xml/namespace';
import '../../../array';
import type { XmlNamespaceDeclaration } from '../../model/xml/declaration';

export class XmlElementFactory {
  private readonly name: string;
  private readonly namespace: XmlNamespace;
  private readonly attributes: XmlAttribute[];
  private readonly children: (string | XmlElement)[];
  private readonly declarations: XmlNamespaceDeclaration[];

  constructor(name: string, namespace: XmlNamespace) {
    this.name = name;
    this.children = [];
    this.attributes = [];
    this.declarations = [];
    this.namespace = namespace;
  }

  get isEmpty(): boolean {
    return this.children.isEmpty() && this.attributes.isEmpty() && this.declarations.isEmpty();
  }

  addAttributes(...attributes: XmlAttribute[]): void {
    this.attributes.push(...attributes);
  }

  addChildren(...children: (string | XmlElement)[]): void {
    this.children.push(...children);
  }

  addDeclarations(...declarations: XmlNamespaceDeclaration[]): void {
    this.declarations.push(...declarations);
  }

  create(): XmlElement {
    return new XmlElement(this.name, this.namespace, this.attributes, this.children, this.declarations);
  }
}
