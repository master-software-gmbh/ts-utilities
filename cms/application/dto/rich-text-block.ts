import type { RichTextSpanDto } from './rich-text-span';
import type { StandardBlockDto } from './standard-block';

export type RichTextBlockDto = {
  id: string;
  type: 'rich-text';
  children: StandardBlockDto[];
  content: {
    spans: RichTextSpanDto[];
  };
};
