import { CmsBlock } from './CmsBlock';
import type { StandardBlock } from './StandardBlock';

export class DocumentBlock extends CmsBlock {
  override type: 'document';
  override content: {
    title: string;
  };

  override get text(): string {
    const parts = [this.content.title];

    for (const child of this.children) {
      parts.push(child.text);
    }

    return parts.join(' ');
  }

  constructor(data: {
    id?: string;
    type: 'document';
    position?: number;
    documentId: string;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
    content: {
      title: string;
    };
  }) {
    super(data);
    this.type = data.type;
    this.content = data.content;
  }

  getBlockById(id: string): StandardBlock | null {
    return this.children.find((block) => block.id === id) || null;
  }
}
