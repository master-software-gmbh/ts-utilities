import type { DocumentBlock } from './DocumentBlock';
import type { FileBlock } from './FileBlock';
import type { PlainTextBlock } from './PlainTextBlock';
import type { RichTextBlock } from './RichTextBlock';

export type StandardBlock = DocumentBlock | FileBlock | RichTextBlock | PlainTextBlock;
