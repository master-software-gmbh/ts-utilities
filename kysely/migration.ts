import {
  type AlterTableBuilder,
  type CreateTableBuilder,
  type Kysely,
  type Migration,
  type MigrationProvider,
  Migrator,
  sql,
} from 'kysely';

type CustomMigration = { description: string; migration: Migration };

export function createMigration(
  description: string,
  up: (db: Kysely<any>) => Promise<void>,
  down: (db: Kysely<any>) => Promise<void>,
): CustomMigration {
  return {
    description,
    migration: {
      up,
      down,
    },
  };
}

export function createTableMigration<TB extends string>(
  tableName: string,
  buildColumns: (builder: CreateTableBuilder<TB, never>) => CreateTableBuilder<TB, never>,
  options: { id?: 'uuid'; created_at?: boolean } = {},
): CustomMigration {
  return createMigration(
    `create-table-${tableName}`,
    async ({ schema }) => {
      let table = schema.createTable(tableName);

      if (options.id === 'uuid') {
        table = table.addColumn('id', 'text', (col) => col.defaultTo(sql`(uuid())`).primaryKey().notNull());
      }

      if (options.created_at) {
        table = table.addColumn('created_at', 'integer', (col) =>
          col.defaultTo(sql`(strftime('%s', 'now'))`).notNull(),
        );
      }

      return buildColumns(table).execute();
    },
    async ({ schema }) => schema.dropTable(tableName).execute(),
  );
}

class InlineMigrationProvider implements MigrationProvider {
  constructor(private readonly migrations: CustomMigration[]) {
    this.migrations = migrations;
  }

  async getMigrations(): Promise<Record<string, Migration>> {
    return Object.fromEntries(
      this.migrations.map((migration, index) => {
        return [`${(index + 1).toString().padStart(4, '0')}-${migration.description}`, migration.migration];
      }),
    );
  }
}

export async function runMigrations(db: Kysely<any>, migrations: CustomMigration[]) {
  const migrator = new Migrator({
    db,
    provider: new InlineMigrationProvider(migrations),
  });

  const { error, results = [] } = await migrator.migrateToLatest();

  for (const result of results) {
    if (result.status === 'Success') {
      console.log(`Migration "${result.migrationName}" executed successfully`);
    } else if (result.status === 'Error') {
      console.error(`Failed to execute migration "${result.migrationName}"`);
    }
  }

  if (error) {
    console.error(error);
  } else {
    console.log('All migrations completed successfully');
  }
}
