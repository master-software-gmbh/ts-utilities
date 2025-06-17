import { CmsBlock } from './CmsBlock';
import type { StandardBlock } from './StandardBlock';

export class DocumentBlock extends CmsBlock<'document'> {
  override type = 'document' as const;
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
    position?: number;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
    content: {
      title: string;
    };
  }) {
    super(data);
    this.content = data.content;
  }

  getBlockById(id: string): StandardBlock | undefined {
    if (this.id === id) {
      return this;
    }

    return this.children.find((block) => block.id === id);
  }
}
