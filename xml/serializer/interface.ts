import type { XmlElement } from '../model/xml/element';

export interface XmlSerializer {
  serialize(object: XmlElement): Promise<string>;
}
