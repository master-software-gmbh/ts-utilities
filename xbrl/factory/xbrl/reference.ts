import { type Result, success } from '../../../result';
import type { LinkReference } from '../../../xml/model/link/reference';
import { XbrlReference } from '../../model/xbrl/reference';
import { BaseFactory } from './base';

export class XbrlReferenceFactory extends BaseFactory<LinkReference, XbrlReference> {
  override map(source: LinkReference): Result<XbrlReference, 'validation_failed'> {
    return success(new XbrlReference(source.children, source.id, source.role));
  }
}
