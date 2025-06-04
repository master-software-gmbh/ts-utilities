import type { Result } from '../../result';
import type { FileContent } from '../../storage';
import type { AudioTransformationOptions } from './dto/options';

export interface AudioTransformationService {
  transform(
    source: ReadableStream,
    options: AudioTransformationOptions & { key: string },
  ): Promise<Result<FileContent, 'missing_dependencies'>>;
}
