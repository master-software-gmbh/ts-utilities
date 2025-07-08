import { Readable } from 'node:stream';
import { loadModule } from '../../../esm';
import { MimeType } from '../../../file';
import { type Result, error, success } from '../../../result';
import { FileContent } from '../../../storage';
import type { ImageTransformationOptions } from '../dto/options';
import type { ImageTransformationService } from '../interface';
import type { ReadableStream } from 'node:stream/web';

type SharpFunction = typeof import('sharp');

export class SharpImageTransformationService implements ImageTransformationService {
  private sharp?: SharpFunction;

  async transform(
    getSource: () => ReadableStream,
    options: ImageTransformationOptions,
  ): Promise<Result<FileContent, 'missing_dependencies'>> {
    const { data: sharp } = await this.getSharp();

    if (!sharp) {
      return error('missing_dependencies');
    }

    const pipeline = this.getSourcePipeline(sharp, options);

    if (options.overlay_text?.length) {
      Readable.fromWeb(getSource()).pipe(pipeline);
      const result = await this.getOverlayPipeline(await pipeline.toBuffer(), sharp, options);

      return success(new FileContent(Readable.toWeb(Readable.from(result)), this.getMimeType(options)));
    }

    return success(
      new FileContent(Readable.toWeb(Readable.fromWeb(getSource()).pipe(pipeline)), this.getMimeType(options)),
    );
  }

  private getMimeType(options: ImageTransformationOptions): MimeType | undefined {
    switch (options.format) {
      case 'jpeg':
        return MimeType.imageJpeg;
      case 'png':
        return MimeType.imagePng;
      case 'webp':
        return MimeType.imageWebp;
      case 'avif':
        return MimeType.imageAvif;
    }
  }

  private getSourcePipeline(sharp: SharpFunction, options: ImageTransformationOptions) {
    let pipeline = sharp();

    if (options.max_width || options.max_height) {
      pipeline = pipeline.resize({
        width: options.max_width,
        withoutEnlargement: true,
        height: options.max_height,
      });
    }

    if (options.format) {
      pipeline = pipeline.toFormat(options.format);
    }

    return pipeline;
  }

  private async getOverlayPipeline(
    source: Buffer<ArrayBufferLike>,
    sharp: SharpFunction,
    options: ImageTransformationOptions,
  ) {
    const sourceSharp = sharp(source);
    const { width = 0, height = 0 } = await sourceSharp.metadata();

    const overlayWidth = Math.round(width * 0.9);
    const overlayHeight = Math.round(height * 0.9);

    const fontFamily = options.overlay_font || 'Arial';

    const overlay = await sharp({
      text: {
        rgba: true,
        font: fontFamily,
        width: overlayWidth,
        height: overlayHeight,
        fontfile: options.overlay_font_path,
        text: `<span color="#FFFFFFB3" background="#FFFFFF01">${options.overlay_text}</span>`,
      },
    })
      .rotate(-45, {
        background: '#00000000',
      })
      .resize({
        fit: 'contain',
        width: overlayWidth,
        height: overlayHeight,
        background: '#00000000',
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    return sharp(source)
      .composite([
        {
          blend: 'over',
          input: overlay,
        },
      ])
      .toBuffer();
  }

  private async getSharp(): Promise<Result<SharpFunction, 'sharp_not_found'>> {
    if (!this.sharp) {
      const { data: module } = await loadModule<SharpFunction>('sharp');

      if (!module) {
        return error('sharp_not_found');
      }

      this.sharp = module;
    }

    return success(this.sharp);
  }
}
