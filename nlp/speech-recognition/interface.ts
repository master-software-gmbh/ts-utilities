import type { Result } from '../../result';
import type { AutomaticSpeechRecognitionOutput } from './types';

export interface AutomaticSpeechRecognitionService {
  transcribeAudio(data: Buffer<ArrayBufferLike>): Promise<Result<AutomaticSpeechRecognitionOutput, 'transcription_failed'>>;
}
