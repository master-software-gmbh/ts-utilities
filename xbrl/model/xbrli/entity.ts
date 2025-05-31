import type { XbrlIdentifier } from './identifier';

export class XbrlEntity {
  identifier: XbrlIdentifier;

  constructor(identifier: XbrlIdentifier) {
    this.identifier = identifier;
  }
}
