import { type Migration, type MigrationProvider, adHocGeneration } from '../../kysely';

export class TerraformMigrations implements MigrationProvider {
  async getMigrations(): Promise<Record<string, Migration>> {
    return {
      '0001_create_terraform_state_table': {
        up(db) {
          return db.schema
            .createTable('terraform_state')
            .addColumn('id', 'text', (col) => col.primaryKey().notNull())
            .addColumn('created_at', 'integer', (col) => col.notNull())
            .addColumn('updated_at', 'integer', (col) => col.notNull())
            .addColumn('name', 'text', (col) => col.notNull().unique())
            .addColumn('content', 'text', (col) => col.notNull())
            .execute();
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new TerraformMigrations());
}
