import {
  AlterTableBuilder,
  type AlterTableColumnAlteringBuilder,
  CreateTableBuilder,
  type Kysely,
  type Migrator,
  sql,
} from 'kysely';
import { logger } from '../../logging';
import { configureForeignKeys } from '../sqlite';
import type { Migration, MigrationProvider } from './types';

export function inlineMigrations(migrations: Record<string, Migration>): MigrationProvider {
  return {
    async getMigrations() {
      return migrations;
    },
  };
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

export async function updateTable(
  db: Kysely<any>,
  tableName: string,
  newTable: (db: CreateTableBuilder<string, never>) => CreateTableBuilder<string, never>,
  convertRow?: (row: Record<string, unknown>) => Record<string, unknown>,
) {
  await db.executeQuery(configureForeignKeys(false));

  await db.transaction().execute(async (transaction) => {
    await newTable(transaction.schema.createTable(`${tableName}_tmp`)).execute();

    const data = await transaction.selectFrom(tableName).selectAll().execute();

    if (data.length > 0) {
      const transformedData = convertRow ? data.map(convertRow) : data;
      await transaction.insertInto(`${tableName}_tmp`).values(transformedData).execute();
    }

    await transaction.schema.dropTable(tableName).execute();
    await transaction.schema.alterTable(`${tableName}_tmp`).renameTo(tableName).execute();
  });

  await db.executeQuery(configureForeignKeys(true));
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
     * The timestamp stores the number of *milliseconds* since the Unix epoch.
     * @param name Name of the column.
     */
    addTimestampColumn(name: string): CreateTableBuilder<TB, C>;
  }

  interface AlterTableBuilder {
    /**
     * Adds a non-nullable UUID column to the table with a default value.
     * @param name The name of the column.
     * @param primaryKey Whether the column should be a primary key. Defaults to true.
     */
    addUUIDColumn(name: string, primaryKey?: boolean): AlterTableColumnAlteringBuilder;

    /**
     * Adds a non-nullable timestamp column to the table with a default value of `now`.
     * The timestamp stores the number of *milliseconds* since the Unix epoch.
     * @param name Name of the column.
     */
    addTimestampColumn(name: string): AlterTableColumnAlteringBuilder;
  }
}

const addUUIDColumn = function (
  this: CreateTableBuilder<string, string> | AlterTableColumnAlteringBuilder,
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

const addTimestampColumn = function (
  this: CreateTableBuilder<string, string> | AlterTableColumnAlteringBuilder,
  name: string,
) {
  return this.addColumn(name, 'integer', (col) => {
    return col.defaultTo(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`).notNull();
  });
};

CreateTableBuilder.prototype.addUUIDColumn = addUUIDColumn as (
  name: string,
  primaryKey?: boolean,
) => CreateTableBuilder<string, string>;

CreateTableBuilder.prototype.addTimestampColumn = addTimestampColumn as (
  name: string,
) => CreateTableBuilder<string, string>;

AlterTableBuilder.prototype.addUUIDColumn = addUUIDColumn as (
  name: string,
  primaryKey?: boolean,
) => AlterTableColumnAlteringBuilder;

AlterTableBuilder.prototype.addTimestampColumn = addTimestampColumn as (
  name: string,
) => AlterTableColumnAlteringBuilder;
