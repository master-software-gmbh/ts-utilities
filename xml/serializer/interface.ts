import type { Result } from '../../result';
import type { XmlDocument } from '../model/xml/document';
import type { XmlElement } from '../model/xml/element';

export interface XmlSerializer {
  serialize(object: XmlElement | XmlDocument): Promise<Result<string, 'xml_conversion_failed' | 'missing_dependencies'>>;
}
