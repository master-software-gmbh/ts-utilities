import type { XmlNamespace } from './xml/namespace';

export type QualifiedName = {
  name: string;
  namespace: XmlNamespace;
};
