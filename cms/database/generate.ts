import { adHocGeneration } from '../../kysely/bun-sqlite/generator';
import { CmsMigrations } from './migrations';

await adHocGeneration(import.meta.dir, new CmsMigrations());
