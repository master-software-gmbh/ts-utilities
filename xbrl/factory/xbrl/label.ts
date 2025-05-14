import { type Result, success } from '../../../result';
import type { LinkLabel } from '../../../xml/model/link/label';
import { XmlNamespaces } from '../../../xml/model/namespaces';
import { XbrlLabel } from '../../model/xbrl/label';
import { BaseFactory } from './base';

export class XbrlLabelFactory extends BaseFactory<LinkLabel, XbrlLabel> {
  override map(source: LinkLabel): Result<XbrlLabel, 'validation_failed'> {
    const lang = source.element.getAttribute('lang', XmlNamespaces.Xml)?.value;
    return success(new XbrlLabel(source.value, source.id, source.role, lang));
  }
}
