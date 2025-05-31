import type { Result } from '../../result';
import type { ImageTransformationOptions } from './dto/options';

export interface ImageTransformationService {
  transform(
    source: ReadableStream,
    options: ImageTransformationOptions,
  ): Promise<Result<ReadableStream, 'missing_dependencies'>>;

  overlay(source: ReadableStream, overlay: string): Promise<Result<ReadableStream, 'missing_dependencies'>>;
}
