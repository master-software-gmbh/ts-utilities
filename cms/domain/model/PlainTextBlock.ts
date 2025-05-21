import { CmsBlock } from './CmsBlock';
import type { StandardBlock } from './StandardBlock';

export class PlainTextBlock extends CmsBlock {
  override type: 'plain-text';
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
    type: 'plain-text';
    position: number;
    documentId: string;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
    content: {
      text: string;
    };
  }) {
    super(data);
    this.type = data.type;
    this.content = data.content;
  }
}
