import type { XmlDocument } from '../model/xml/document';
import type { XmlElement } from '../model/xml/element';

export interface XmlSerializable {
  toXML(): Promise<XmlElement | XmlDocument>;
}

export interface XmlSerializer {
  serialize(object: XmlSerializable): Promise<string>;
}
