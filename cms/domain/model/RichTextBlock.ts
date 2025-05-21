import { CmsBlock } from './CmsBlock';
import type { RichTextSpan } from './RichTextSpan';
import type { StandardBlock } from './StandardBlock';

export class RichTextBlock extends CmsBlock {
  override type: 'rich-text';
  override content: {
    spans: RichTextSpan[];
  };

  override get text(): string {
    const parts = this.content.spans.map((span) => span.text);

    for (const child of this.children) {
      parts.push(child.text);
    }

    return parts.join(' ');
  }

  constructor(data: {
    id?: string;
    type: 'rich-text';
    position: number;
    documentId: string;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
    content: {
      spans: RichTextSpan[];
    };
  }) {
    super(data);
    this.type = data.type;
    this.content = data.content;
  }
}
