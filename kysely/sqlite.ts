import { CompiledQuery } from 'kysely';

/**
 * Returns a query that enables foreign key constraints.
 */
export function enableForeignKeys(): CompiledQuery {
  return CompiledQuery.raw('PRAGMA foreign_keys = ON;');
}

/**
 * Returns a query that enables Write-Ahead Logging (WAL) mode.
 */
export function enableWalMode(schema?: string): CompiledQuery {
  if (schema) {
    return CompiledQuery.raw(`PRAGMA ${schema}.journal_mode = WAL;`);
  }

  return CompiledQuery.raw('PRAGMA journal_mode = WAL;');
}

/**
 * Returns a query that lists attached databases.
 */
export function listDatabases(): CompiledQuery {
  return CompiledQuery.raw('PRAGMA database_list;');
}
