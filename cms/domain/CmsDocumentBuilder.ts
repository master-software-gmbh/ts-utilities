import { randomUUID } from 'node:crypto';
import type { FileBlockDto, RichTextBlockDto } from '../application/dto';
import { DocumentBlock, FileBlock, RichTextBlock, type StandardBlock } from './model';

export class CmsDocumentBuilder {
  private title = '';
  private readonly id = randomUUID();
  private readonly blocks: StandardBlock[] = [];

  build(): DocumentBlock {
    return new DocumentBlock({
      id: this.id,
      documentId: this.id,
      children: this.blocks,
      content: {
        title: this.title,
      },
    });
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  addRichTextBlock(content?: RichTextBlockDto['content']): this {
    this.blocks.push(
      new RichTextBlock({
        parentId: this.id,
        documentId: this.id,
        position: this.blocks.length,
        content: content ?? {
          spans: [
            {
              text: '',
              attributes: {},
            },
          ],
        },
      }),
    );

    return this;
  }

  addFileRefBlock(content: FileBlockDto['content']): this {
    this.blocks.push(
      new FileBlock({
        content: content,
        parentId: this.id,
        documentId: this.id,
        position: this.blocks.length,
      }),
    );

    return this;
  }
}
