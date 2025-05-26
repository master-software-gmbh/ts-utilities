import { typedFetch } from '../../http';
import { type Result, error } from '../../result';
import { secondsToMilliseconds } from '../../time';
import type { AutomaticSpeechRecognitionService } from './interface';
import {
  type AutomaticSpeechRecognitionOutput,
  AutomaticSpeechRecognitionOutputSchema,
  AutomaticSpeechRecognitionServiceConfig,
} from './types';
import { readFileSync } from 'fs';

export class AutomaticSpeechRecognitionServiceImpl implements AutomaticSpeechRecognitionService {
  private readonly config: AutomaticSpeechRecognitionServiceConfig;

  constructor(config: AutomaticSpeechRecognitionServiceConfig) {
    this.config = config;
  }

  async transcribeAudio(data: Buffer<ArrayBufferLike>): Promise<Result<AutomaticSpeechRecognitionOutput, 'transcription_failed'>> {
    const formData = new FormData();
    formData.append('audio', new Blob([data]));

    const result = await typedFetch(
      this.config.url,
      {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(this.config.timeout),
      },
      (response) => response.json(),
      AutomaticSpeechRecognitionOutputSchema,
    );

    if (!result.success) {
      return error('transcription_failed');
    }

    return result;
  }
}
