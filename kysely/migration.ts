import { CreateTableBuilder, type Migration, type MigrationProvider, type Migrator, sql } from 'kysely';
import { logger } from '../logging';

export function inlineMigrations(migrations: Record<string, Migration>): MigrationProvider {
  return {
    async getMigrations() {
      return migrations;
    },
  };
}

/**
 * A migration provider that combines multiple migration providers into a single provider.
 * Migrations are ordered by the order in which the providers are passed to the constructor.
 * If multiple providers contain migrations with the same name, an error is thrown.
 */
export class CompositeMigrationProvider implements MigrationProvider {
  private readonly providers: MigrationProvider[];

  constructor(providers: MigrationProvider[]) {
    this.providers = providers;
  }

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};

    for (const provider of this.providers) {
      for (const [name, migration] of Object.entries(await provider.getMigrations())) {
        if (migrations[name]) {
          throw new Error(`Duplicate migration name: ${name}`);
        }

        migrations[name] = migration;
      }
    }

    return migrations;
  }
}

export async function runMigrations(migrator: Migrator) {
  const { error, results } = await migrator.migrateToLatest();

  if (!results) {
    logger.error('Failed to execute migrations', { error });
    return;
  }

  for (const result of results) {
    if (result.status === 'Success') {
      logger.info('Migration executed successfully', {
        name: result.migrationName,
      });
    } else if (result.status === 'Error') {
      logger.error('Failed to execute migration', {
        error,
      });
    }
  }

  if (!error) {
    logger.info('All migrations completed successfully');
  }
}

declare module 'kysely' {
  interface CreateTableBuilder<TB extends string, C extends string = never> {
    /**
     * Adds a non-nullable UUID column to the table with a default value.
     * @param name The name of the column.
     * @param primaryKey Whether the column should be a primary key. Defaults to true.
     */
    addUUIDColumn(name: string, primaryKey?: boolean): CreateTableBuilder<TB, C>;

    /**
     * Adds a non-nullable timestamp column to the table with a default value of `now`.
     * The timestamp stores the number of seconds since the Unix epoch.
     * @param name Name of the column.
     */
    addTimestampColumn(name: string): CreateTableBuilder<TB, C>;
  }
}

CreateTableBuilder.prototype.addUUIDColumn = function (
  this: CreateTableBuilder<string, string>,
  name: string,
  primaryKey = true,
) {
  return this.addColumn(name, 'text', (col) => {
    col = col.defaultTo(sql`(uuid())`).notNull();

    if (primaryKey) {
      col = col.primaryKey();
    }

    return col;
  });
};

CreateTableBuilder.prototype.addTimestampColumn = function (this: CreateTableBuilder<string, string>, name: string) {
  return this.addColumn(name, 'integer', (col) => {
    return col.defaultTo(sql`(strftime('%s', 'now'))`).notNull();
  });
};
