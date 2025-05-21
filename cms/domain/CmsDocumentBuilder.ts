import { randomUUID } from 'crypto';
import type { DocumentBlockDto, FileBlockDto, RichTextBlockDto, StandardBlockDto } from '../application/dto';

export class CmsDocumentBuilder {
  private title = '';
  private blocks: StandardBlockDto[] = [];

  build(): DocumentBlockDto {
    const id = randomUUID();

    return {
      id: id,
      type: 'document',
      children: this.blocks,
      content: {
        title: this.title,
      },
    };
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  addRichTextBlock(content?: RichTextBlockDto['content']): this {
    this.blocks.push({
      children: [],
      id: randomUUID(),
      type: 'rich-text',
      content: content ?? {
        spans: [
          {
            text: '',
            attributes: {},
          },
        ],
      },
    });

    return this;
  }

  addFileRefBlock(content: FileBlockDto['content']): this {
    this.blocks.push({
      children: [],
      id: randomUUID(),
      type: 'file-ref',
      content: content,
    });

    return this;
  }
}
