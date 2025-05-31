import { type InferOutput, object, string } from 'valibot';
import { Mergeable } from '../../map/mergeable';

export class AutomaticSpeechRecognitionServiceConfig extends Mergeable<AutomaticSpeechRecognitionServiceConfig> {
  url: string;
  timeout: number;

  constructor(url: string, timeout = 5000) {
    super();
    this.url = url;
    this.timeout = timeout;
  }
}

export const AutomaticSpeechRecognitionOutputSchema = object({
  transcript: string(),
});

export type AutomaticSpeechRecognitionOutput = InferOutput<typeof AutomaticSpeechRecognitionOutputSchema>;
