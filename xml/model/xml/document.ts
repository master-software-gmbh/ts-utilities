import type { XmlNamespaceDeclaration } from './declaration';
import type { XmlElement } from './element';

export class XmlDocument {
  root: XmlElement;

  /**
   * XML namespaces that are declared externally
   */
  declarations: XmlNamespaceDeclaration[];

  constructor(root: XmlElement, declarations: XmlNamespaceDeclaration[] = []) {
    this.root = root;
    this.declarations = declarations;
  }
}
