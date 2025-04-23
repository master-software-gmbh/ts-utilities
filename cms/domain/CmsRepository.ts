import type { Modifiable } from '../../interface/modifiable';
import type { Retrievable } from '../../interface/retrievable';
import type { BaseDocument } from './document';

export type CmsRepository = Retrievable<string, BaseDocument> & Modifiable<string, BaseDocument>;
