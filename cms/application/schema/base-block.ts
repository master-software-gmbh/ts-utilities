import { type GenericSchema, array, lazy, object, string, unknown } from 'valibot';
import type { BaseBlock } from '../dto';

export const BaseBlockSchema: GenericSchema<BaseBlock> = object({
  id: string(),
  type: string(),
  content: unknown(),
  children: lazy(() => array(BaseBlockSchema)),
});
