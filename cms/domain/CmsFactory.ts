import type { RichTextBlock } from './blocks';
import type { StandardDocument } from './document';
import { randomUUID } from 'crypto';

export class CmsFactory {
  buildStandardDocument(title: string): StandardDocument {
    const id = randomUUID();
    const date = new Date();

    return {
      id: id,
      title: title,
      createdAt: date,
      updatedAt: date,
      blocks: [this.buildRichTextBlock()],
    };
  }

  buildRichTextBlock(): RichTextBlock {
    const date = new Date();

    return {
      createdAt: date,
      updatedAt: date,
      id: randomUUID(),
      type: 'rich-text',
      content: {
        text: '',
        spans: [
          {
            text: '',
            attributes: {},
          },
        ],
      },
    };
  }
}
