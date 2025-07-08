import type { Result } from '../../result';
import type { FileContent } from '../../storage';
import type { ReadableStream } from 'node:stream/web';

export interface MediaTransformationService<T> {
  transform(
    getSource: () => ReadableStream,
    options: T & { key: string },
  ): Promise<Result<FileContent, 'missing_dependencies'>>;
}
