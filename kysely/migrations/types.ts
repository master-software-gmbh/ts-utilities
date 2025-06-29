import type { Migration as KyselyMigration } from 'kysely';

export type Migration = KyselyMigration & {
  dependencies?: string[];
};

export interface MigrationProvider {
  getMigrations(): Promise<Record<string, Migration>>;
}
