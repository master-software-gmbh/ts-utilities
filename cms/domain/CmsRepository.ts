import type { Modifiable } from '../../interface/modifiable';
import type { Retrievable } from '../../interface/retrievable';
import type { StandardBlock } from './model/StandardBlock';

export type CmsRepository = Retrievable<string, StandardBlock> &
  Modifiable<string, StandardBlock> & {
    byParent: (parentId: string | null) => CmsRepository;
  };
