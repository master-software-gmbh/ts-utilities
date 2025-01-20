import { z } from 'zod';

export const timestamp = z.number().min(0).describe('Unix timestamp in seconds');
