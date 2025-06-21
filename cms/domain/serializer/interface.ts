import type { DocumentBlockDto } from '../../application/dto';

export interface CmsBlockSerializer {
  serialize(block: DocumentBlockDto): Promise<string>;
}
