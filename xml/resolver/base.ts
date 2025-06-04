import type { Cache } from '../../cache';
import { type Result, success } from '../../result';
import { Readable } from 'node:stream';
import { FileContent } from '../../storage';

export abstract class XmlBaseResolver {
  protected readonly cache?: Cache<string, FileContent>;

  constructor(cache?: Cache<string, FileContent>) {
    this.cache = cache;
  }

  async resolve(source: string, base?: string) {
    const uri = this.getUri(source, base);

    let content: string | undefined;

    const cached = await this.cache?.get(source);

    if (cached) {
      content = await Bun.readableStreamToText(cached.stream);
    } else {
      const result = await this.resolveUri(uri);

      if (!result.success) {
        return result;
      }

      content = result.data;
      await this.cache?.set(source, new FileContent(Readable.toWeb(Readable.from(result.data))));
    }

    return success({
      uri: uri,
      content: content,
    });
  }

  protected abstract getUri(source: string, base?: string): string;
  protected abstract resolveUri(uri: string): Promise<Result<string, 'invalid_source'>>;
}
