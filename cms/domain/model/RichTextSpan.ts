export class RichTextSpan {
  text: string;
  attributes: Record<string, string | number | boolean>;

  constructor(text: string, attributes: Record<string, string | number | boolean>) {
    this.text = text;
    this.attributes = attributes;
  }
}
