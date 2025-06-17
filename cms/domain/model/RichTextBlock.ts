import { CmsBlock } from './CmsBlock';
import type { RichTextSpan } from './RichTextSpan';
import type { StandardBlock } from './StandardBlock';

export class RichTextBlock extends CmsBlock<'rich-text'> {
  override type = 'rich-text' as const;
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
    position: number;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
    content: {
      spans: RichTextSpan[];
    };
  }) {
    super(data);
    this.content = data.content;
  }
}
