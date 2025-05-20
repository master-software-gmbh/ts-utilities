import { randomUUID } from 'crypto';
import type { DocumentBlock, FileBlock, RichTextBlock } from './dto';
import type { StandardBlock } from './dto/standard-block';

export class CmsDocumentBuilder {
  private title = '';
  private blocks: StandardBlock['children'] = [];

  build(): DocumentBlock {
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

  addRichTextBlock(content?: RichTextBlock['content']): this {
    this.blocks.push({
      children: [],
      id: randomUUID(),
      type: 'rich-text',
      content: content ?? {
        text: '',
        spans: [
          {
            text: '',
            attributes: {},
          },
        ],
      },
    } satisfies StandardBlock);

    return this;
  }

  addFileRefBlock(content: FileBlock['content']): this {
    this.blocks.push({
      children: [],
      id: randomUUID(),
      type: 'file-ref',
      content: content,
    } satisfies StandardBlock);

    return this;
  }
}
