import { type GenericSchema, array, lazy, object, string, unknown } from 'valibot';

export type BaseBlock = {
  id: string;
  type: string;
  content: unknown;
  children: BaseBlock[];
};

export const BaseBlock: GenericSchema<BaseBlock> = object({
  id: string(),
  type: string(),
  content: unknown(),
  children: lazy(() => array(BaseBlock)),
});
