import { adHocGeneration } from '../kysely/bun-sqlite/generator';
import { DmsMigrations } from './migration';

await adHocGeneration(import.meta.dir, new DmsMigrations());
