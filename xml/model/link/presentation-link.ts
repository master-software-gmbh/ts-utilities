import {
  XlinkExtendedType,
  type Attributes as XlinkExtendedTypeAttributes,
  type Children as XlinkExtendedTypeChildren,
} from '../xlink/extended-type';
import { LinkPresentationArc } from './presentation-arc';

export type Attributes = XlinkExtendedTypeAttributes;

export type Children = XlinkExtendedTypeChildren;

export class LinkPresentationLink extends XlinkExtendedType {
  get presentationArcs(): LinkPresentationArc[] {
    return this.children.filter((child) => child instanceof LinkPresentationArc);
  }
}
