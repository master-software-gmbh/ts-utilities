import type { MediaTransformationService } from '../../media/transformation/interface';
import type { ImageTransformationOptions } from './dto/options';

export type ImageTransformationService = MediaTransformationService<ImageTransformationOptions>;
