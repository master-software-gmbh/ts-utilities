import { CmsBlock } from './CmsBlock';
import type { StandardBlock } from './StandardBlock';

export class PlainTextBlock extends CmsBlock<'plain-text'> {
  override type = 'plain-text' as const;
  override content: {
    text: string;
  };

  override get text(): string {
    const parts = [this.content.text];

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
      text: string;
    };
  }) {
    super(data);
    this.content = data.content;
  }
}
