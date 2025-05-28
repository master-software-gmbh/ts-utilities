import { loadModule } from '../../esm';
import { error, success, type Result } from '../../result';
import type { ImageTransformationService } from './interface';
import type { ImageTransformationOptions } from './dto/options';
import { Readable } from 'node:stream';

export class SharpImageTransformationService implements ImageTransformationService {
  private sharp: typeof import('sharp') | undefined;

  async transform(
    source: ReadableStream,
    options: ImageTransformationOptions,
  ): Promise<Result<ReadableStream, 'missing_dependencies'>> {
    const { data: sharp } = await this.getSharp();

    if (!sharp) {
      return error('missing_dependencies');
    }

    const pipeline = sharp()
      .resize({
        width: options.maxWidth,
        withoutEnlargement: true,
        height: options.maxHeight,
      })
      .toFormat(options.format);

    return success(Readable.toWeb(Readable.fromWeb(source).pipe(pipeline)));
  }

  private async getSharp(): Promise<Result<typeof import('sharp'), 'sharp_not_found'>> {
    if (!this.sharp) {
      const { data: module } = await loadModule<typeof import('sharp')>('sharp');

      if (!module) {
        return error('sharp_not_found');
      }

      this.sharp = module;
    }

    return success(this.sharp);
  }
}
