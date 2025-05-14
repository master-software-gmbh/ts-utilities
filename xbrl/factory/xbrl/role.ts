import { error, success } from '../../../result';
import type { LinkRoleType } from '../../../xml/model/link/role-type';
import { XbrlRole } from '../../model/xbrl/role';
import { BaseFactory } from './base';
import '../../../array';

export class XbrlRoleFactory extends BaseFactory<LinkRoleType, XbrlRole> {
  override map(source: LinkRoleType) {
    const definition = source.definition?.value;
    const usedOn = source.usedOn.map((usedOn) => usedOn.value);

    if (usedOn.isEmpty()) {
      return error('validation_failed');
    }

    return success(new XbrlRole(usedOn, definition));
  }
}
