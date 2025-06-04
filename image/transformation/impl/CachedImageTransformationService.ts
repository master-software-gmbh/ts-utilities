import type { Cache } from '../../../cache';
import { success, type Result } from '../../../result';
import { FileContent } from '../../../storage';
import type { NestedRecord, Primitive } from '../../../types';
import type { ImageTransformationOptions } from './../dto/options';
import type { ImageTransformationService } from './../interface';

type CacheKey = Primitive | NestedRecord;

export class CachedImageTransformationService implements ImageTransformationService {
  private readonly cache: Cache<CacheKey, FileContent>;
  private readonly service: ImageTransformationService;

  constructor(cache: Cache<CacheKey, FileContent>, service: ImageTransformationService) {
    this.cache = cache;
    this.service = service;
  }

  async transform(
    getSource: () => ReadableStream,
    options: ImageTransformationOptions & { key: string },
  ): Promise<Result<FileContent, 'missing_dependencies'>> {
    const key = {
      id: options.key,
      options: options,
    };

    const exists = await this.cache.get(key);

    if (exists) {
      return success(exists);
    }

    const result = await this.service.transform(getSource, options);

    if (!result.success) {
      return result;
    }

    // Split up stream for multiple consumers
    const [first, second] = result.data.stream.tee();

    await this.cache.set(key, new FileContent(first, result.data.type, result.data.url));

    return success(new FileContent(second, result.data.type, result.data.url));
  }
}
