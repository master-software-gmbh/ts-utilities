import type { MediaTransformationService } from '../../media/transformation/interface';
import type { AudioTransformationOptions } from './dto/options';

export type AudioTransformationService = MediaTransformationService<AudioTransformationOptions>;
