import type { DocumentBlockDto } from './document-block';
import type { FileBlockDto } from './file-block';
import type { PlainTextBlockDto } from './plain-text-block';
import type { RichTextBlockDto } from './rich-text-block';

export type StandardBlockDto = DocumentBlockDto | RichTextBlockDto | PlainTextBlockDto | FileBlockDto;
