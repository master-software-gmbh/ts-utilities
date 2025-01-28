import {
  type AlterTableBuilder,
  type AlterTableColumnAlteringBuilder,
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

class EnhancedCreateTableBuilder<TB extends string> {
  constructor(public rawBuilder: CreateTableBuilder<TB, never>) {}

  /**
   * Adds a non-nullable UUID column to the table with a default value.
   * @param name The name of the column.
   * @param primaryKey Whether the column should be a primary key. Defaults to true.
   */
  addUUIDColumn(name: string, primaryKey = true): this {
    this.rawBuilder = this.rawBuilder.addColumn(name, 'text', (col) => {
      let newCol = col.defaultTo(sql`(uuid())`).notNull();

      if (primaryKey) {
        newCol = newCol.primaryKey();
      }

      return newCol;
    });

    return this;
  }

  /**
   * Adds a non-nullable timestamp column to the table with a default value of `now`.
   * The timestamp stores the number of seconds since the Unix epoch.
   * @param name Name of the column.
   */
  addTimestampColumn(name: string): this {
    this.rawBuilder = this.rawBuilder.addColumn(name, 'integer', (col) =>
      col.defaultTo(sql`(strftime('%s', 'now'))`).notNull(),
    );
    return this;
  }
}

export function createTableMigration<TB extends string>(
  tableName: string,
  buildColumns: (builder: EnhancedCreateTableBuilder<TB>) => CreateTableBuilder<TB, never>,
): CustomMigration {
  return createMigration(
    `create-table-${tableName}`,
    async ({ schema }) => buildColumns(new EnhancedCreateTableBuilder(schema.createTable(tableName))).execute(),
    async ({ schema }) => schema.dropTable(tableName).execute(),
  );
}

export function updateTableMigration(
  tableName: string,
  addColumns: (builder: AlterTableBuilder) => AlterTableColumnAlteringBuilder,
  removeColumns: (builder: AlterTableBuilder) => AlterTableColumnAlteringBuilder,
): CustomMigration {
  return createMigration(
    `update-table-${tableName}`,
    async ({ schema }) => {
      const table = schema.alterTable(tableName);
      return addColumns(table).execute();
    },
    async ({ schema }) => {
      const table = schema.alterTable(tableName);
      return removeColumns(table).execute();
    },
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
