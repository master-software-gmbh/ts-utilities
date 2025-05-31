import type { QName } from '../../../xml/model/qualified-name';
import { XsBoolean } from '../../../xml/model/xs/boolean';
import { XsDate } from '../../../xml/model/xs/date';
import { XsString } from '../../../xml/model/xs/string';

export type Values = (XsString | XsBoolean | XsDate | unknown)[];

export class XbrlReference {
  id?: string;
  role?: string;
  values: Values;

  constructor(values: Values, id?: string, role?: string) {
    this.id = id;
    this.role = role;
    this.values = values;
  }

  getValue(name: QName) {
    for (const value of this.values) {
      if (value instanceof XsString || value instanceof XsBoolean || value instanceof XsDate) {
        if (value.element.matchesName(name)) {
          return value;
        }
      }
    }

    return undefined;
  }
}
