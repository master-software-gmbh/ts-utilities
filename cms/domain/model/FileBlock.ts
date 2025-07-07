import { MimeTypeToFileExtension } from '../../../file';
import { CmsBlock } from './CmsBlock';
import type { StandardBlock } from './StandardBlock';

export class FileBlock extends CmsBlock<'file-ref'> {
  override type = 'file-ref' as const;
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
    position: number;
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
    this.content = data.content;
  }

  get isImageBlock(): boolean {
    return this.content.type.startsWith('image/');
  }

  get isAudioBlock(): boolean {
    return this.content.type.startsWith('audio/');
  }

  get normalizedName(): string {
    const [extension] = MimeTypeToFileExtension[this.content.type] ?? [];

    if (extension) {
      const basename = this.content.name.includes('.')
        ? (this.content.name.split('.') as [string, string])[0]
        : this.content.name;

      return `${basename}.${extension}`;
    }

    return this.content.name;
  }
}
