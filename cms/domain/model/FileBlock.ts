import { CmsBlock } from './CmsBlock';
import type { StandardBlock } from './StandardBlock';

export class FileBlock extends CmsBlock {
  override type: 'file-ref';
  override content: {
    id: string;
    name: string;
    type: string;
  };

  override get text(): string {
    const parts = [this.content.name];

    for (const child of this.children) {
      parts.push(child.text);
    }

    return parts.join(' ');
  }

  constructor(data: {
    id?: string;
    type: 'file-ref';
    position: number;
    documentId: string;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
    content: {
      id: string;
      name: string;
      type: string;
    };
  }) {
    super(data);
    this.type = data.type;
    this.content = data.content;
  }

  get isImageBlock(): boolean {
    return this.content.type.startsWith('image/');
  }

  get isAudioBlock(): boolean {
    return this.content.type.startsWith('audio/');
  }
}
