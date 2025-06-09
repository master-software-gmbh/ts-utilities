import type { Result } from '../../result';
import type { XmlDocument } from '../model/xml/document';
import type { XmlElement } from '../model/xml/element';

export interface XmlSerializable {
  toXML(): Promise<Result<XmlElement | XmlDocument, 'xml_conversion_failed'>>;
}

export interface XmlSerializer {
  serialize(object: XmlSerializable): Promise<Result<string, 'xml_conversion_failed' | 'missing_dependencies'>>;
}
