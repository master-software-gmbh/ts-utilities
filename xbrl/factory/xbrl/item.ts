import { optional, picklist } from 'valibot';
import { error, success } from '../../../result';
import { XmlNamespaces } from '../../../xml/model/namespaces';
import type { XsElement } from '../../../xml/model/xs/element';
import { XbrlItem } from '../../model/xbrl/item';
import { BaseFactory } from './base';

export class XbrlItemFactory extends BaseFactory<XsElement, XbrlItem> {
  override map(source: XsElement) {
    const balanceResult = this.parseAttribute(
      source,
      'balance',
      XmlNamespaces.XbrlInstance,
      optional(picklist(['credit', 'debit'])),
    );

    const periodTypeResult = this.parseAttribute(
      source,
      'periodType',
      XmlNamespaces.XbrlInstance,
      optional(picklist(['instant', 'duration'])),
    );

    if (!balanceResult.success || !periodTypeResult.success) {
      return error('validation_failed');
    }

    return success(new XbrlItem(source.id, source.name, source.targetNamespace, balanceResult.data, periodTypeResult.data));
  }
}
