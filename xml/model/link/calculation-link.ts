import {
  XlinkExtendedType,
  type Attributes as XlinkExtendedTypeAttributes,
  type Children as XlinkExtendedTypeChildren,
} from '../xlink/extended-type';
import { LinkCalculationArc } from './calculation-arc';

export type Attributes = XlinkExtendedTypeAttributes;

export type Children = XlinkExtendedTypeChildren;

export class LinkCalculationLink extends XlinkExtendedType {
  get calculationArcs(): LinkCalculationArc[] {
    return this.children.filter((child) => child instanceof LinkCalculationArc);
  }
}
