import type { Cache } from '../../../cache';
import { success, type Result } from '../../../result';
import { FileContent } from '../../../storage';
import type { NestedRecord, Primitive } from '../../../types';
import type { AudioTransformationOptions } from '../dto/options';
import type { AudioTransformationService } from '../interface';

type CacheKey = Primitive | NestedRecord;

export class CachedAudioTransformationService implements AudioTransformationService {
  private readonly cache: Cache<CacheKey, FileContent>;
  private readonly service: AudioTransformationService;

  constructor(cache: Cache<CacheKey, FileContent>, service: AudioTransformationService) {
    this.cache = cache;
    this.service = service;
  }

  async transform(
    source: ReadableStream,
    options: AudioTransformationOptions & { key: string },
  ): Promise<Result<FileContent, 'missing_dependencies'>> {
    const key = {
      id: options.key,
      options: options,
    };

    const exists = await this.cache.get(key);

    if (exists) {
      return success(exists);
    }

    const result = await this.service.transform(source, options);

    if (!result.success) {
      return result;
    }

    // Split up stream for multiple consumers
    const [first, second] = result.data.stream.tee();

    await this.cache.set(key, new FileContent(first, result.data.type, result.data.url));

    return success(new FileContent(second, result.data.type, result.data.url));
  }
}
