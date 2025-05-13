import type { XmlNamespace } from './namespace';

export class XmlAttribute {
  name: string;
  value: string;
  namespace: XmlNamespace | null;

  constructor(name: string, value: string, namespace: XmlNamespace | null) {
    this.name = name;
    this.value = value;
    this.namespace = namespace;
  }
}
