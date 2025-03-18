import type { FileRefBlock, HeadingBlock, PlainTextBlock, RichTextBlock } from './blocks';
import type { BaseBlock } from './blocks/base';
import type { Document } from './document';

export type CmsBlock<T = unknown> = BaseBlock & {
  content: T;
};

export type StandardBlock = PlainTextBlock | RichTextBlock | HeadingBlock | FileRefBlock;

export type CmsDocument = Document & {
  blocks: StandardBlock[];
};
