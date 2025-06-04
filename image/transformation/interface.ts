import type { Result } from '../../result';
import type { FileContent } from '../../storage';
import type { ImageTransformationOptions } from './dto/options';

export interface ImageTransformationService {
  transform(
    getSource: () => ReadableStream,
    options: ImageTransformationOptions & { key: string },
  ): Promise<Result<FileContent, 'missing_dependencies'>>;
}
