import type { Result } from '../../result';
import type { XmlElement } from '../model/xml/element';

export interface XmlSerializer {
  serialize(object: XmlElement): Promise<Result<string, 'missing_dependencies'>>;
}
