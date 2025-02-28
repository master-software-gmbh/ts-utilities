import { adHocGeneration } from '../kysely/bun-sqlite/generator';
import { DmsMigrations } from './migrations';

await adHocGeneration(import.meta.dir, new DmsMigrations());
