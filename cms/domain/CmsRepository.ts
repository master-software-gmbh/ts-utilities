import type { Modifiable } from '../../interface/modifiable';
import type { Retrievable } from '../../interface/retrievable';
import type { CmsBlock } from './model/CmsBlock';

export type CmsRepository = Retrievable<string, CmsBlock> & Modifiable<string, CmsBlock>;
