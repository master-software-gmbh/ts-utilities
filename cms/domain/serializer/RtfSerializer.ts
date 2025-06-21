import type { DocumentBlockDto, RichTextBlockDto, RichTextSpanDto } from '../../application/dto';
import type { CmsBlockSerializer } from './interface';

export class RtfCmsBlockSerializer implements CmsBlockSerializer {
  async serialize(document: DocumentBlockDto): Promise<string> {
    let body = '';

    for (const block of document.children) {
      if (block.type === 'rich-text') {
        body += this.serializeBlock(block);
      } else if (block.type === 'file-ref') {
        if (block.content.type.startsWith('image/')) {
          body += `\\b Bild: ${this.escapeRTF(block.content.name)} \\b0\\par\\par `;
        } else if (block.content.type.startsWith('audio/')) {
          body += `\\b Ton: ${this.escapeRTF(block.content.name)} \\b0\\par\\par `;
        }
      }
    }

    return `{\\rtf1\\ansi ${body}}`;
  }

  private escapeRTF(text: string): string {
    return [...text]
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code === 92) return '\\\\'; // \
        if (code === 123) return '\\{'; // {
        if (code === 125) return '\\}'; // }
        if (code < 128) return char; // ASCII
        return `\\u${code}?`; // Unicode
      })
      .join('');
  }

  private serializeSpan(span: RichTextSpanDto): string {
    const { text, attributes } = span;
    let result = '';

    if (attributes['bold']) result += '\\b ';
    if (attributes['italic']) result += '\\i ';
    if (attributes['underline']) result += '\\ul ';

    result += this.escapeRTF(text);

    if (attributes['underline']) result += ' \\ul0';
    if (attributes['italic']) result += ' \\i0';
    if (attributes['bold']) result += ' \\b0';

    return result;
  }

  private serializeBlock(block: RichTextBlockDto): string {
    return `${block.content.spans.map(this.serializeSpan.bind(this)).join('')}\\par\\par `;
  }
}
