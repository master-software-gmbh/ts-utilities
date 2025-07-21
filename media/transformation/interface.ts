import type { ReadableStream } from 'node:stream/web';
import type { Result } from '../../result';
import type { FileContent } from '../../storage';

export interface MediaTransformationService<T> {
  transform(
    getSource: () => ReadableStream,
    options: T & { key: string },
  ): Promise<Result<FileContent, 'missing_dependencies'>>;
}
