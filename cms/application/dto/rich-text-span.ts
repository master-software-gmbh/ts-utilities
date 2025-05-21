export type RichTextAttributeType = string | number | boolean;

export type RichTextSpanDto = {
  text: string;
  attributes: Record<string, RichTextAttributeType>;
};
