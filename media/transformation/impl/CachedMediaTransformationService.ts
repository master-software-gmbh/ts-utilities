import type { Cache } from '../../../cache';
import { type Result, success } from '../../../result';
import type { FileContent } from '../../../storage';
import type { NestedRecord, Primitive } from '../../../types';
import type { MediaTransformationService } from '../interface';
import type { ReadableStream } from 'node:stream/web';

type CacheKey = Primitive | NestedRecord;

export class CachedMediaTransformationService<T, S extends MediaTransformationService<T>>
  implements MediaTransformationService<T>
{
  private readonly cache: Cache<CacheKey, FileContent>;
  private readonly service: S;

  constructor(cache: Cache<CacheKey, FileContent>, service: S) {
    this.cache = cache;
    this.service = service;
  }

  async transform(
    getSource: () => ReadableStream,
    options: T & { key: string },
  ): Promise<Result<FileContent, 'missing_dependencies'>> {
    const key = {
      id: options.key,
      options: options,
    };

    const cachedContent = await this.cache.get(key);

    if (cachedContent) {
      return success(cachedContent);
    }

    const result = await this.service.transform(getSource, options);

    if (!result.success) {
      return result;
    }

    this.cache.set(key, result.data);

    return success(result.data);
  }
}
