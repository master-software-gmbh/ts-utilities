import { loadModule } from '../../../esm';
import { PassThrough, Readable } from 'node:stream';
import { error, success, type Result } from '../../../result';
import type { AudioTransformationService } from '../interface';
import { FileContent } from '../../../storage';
import { MimeType } from '../../../file';
import type { AudioTransformationOptions } from '../dto/options';
import type { FfmpegCommand } from 'fluent-ffmpeg';

type Ffmpeg = typeof import('fluent-ffmpeg');

export class FfmpegAudioTransformationService implements AudioTransformationService {
  private ffmpeg?: Ffmpeg;

  async transform(
    source: ReadableStream,
    options: AudioTransformationOptions,
  ): Promise<Result<FileContent, 'missing_dependencies'>> {
    const { data: ffmpeg } = await this.getFfmpeg();

    if (!ffmpeg) {
      return error('missing_dependencies');
    }

    const output = new PassThrough();

    let command: FfmpegCommand;
    let outputType: string | undefined;

    if (options.overlay_path) {
      command = this.getOverlayCommand(ffmpeg, Readable.fromWeb(source), options.overlay_path);
    } else {
      command = ffmpeg(Readable.fromWeb(source));
    }

    if (options.format === 'mp3') {
      command = command.audioCodec('libmp3lame').format('mp3');
      outputType = MimeType.audioMpeg;
    }

    command.stream(output);

    return success(new FileContent(Readable.toWeb(output), outputType));
  }

  private getOverlayCommand(ffmpeg: Ffmpeg, source: Readable, path: string): FfmpegCommand {
    return ffmpeg(path)
      .inputOption('-stream_loop -1')
      .input(source)
      .complexFilter([
        {
          filter: 'amix',
          options: {
            duration: 'shortest',
            weights: '1 0.75',
          },
          inputs: ['0:a', '1:a'],
        },
      ]);
  }

  private async getFfmpeg(): Promise<Result<Ffmpeg, 'ffmpeg_not_found'>> {
    if (!this.ffmpeg) {
      const { data: module } = await loadModule<Ffmpeg>('fluent-ffmpeg');

      if (!module) {
        return error('ffmpeg_not_found');
      }

      this.ffmpeg = module;
    }

    return success(this.ffmpeg);
  }
}
