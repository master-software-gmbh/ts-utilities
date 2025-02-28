import { CompiledQuery, type DatabaseConnection } from 'kysely';

/**
 * Enables foreign key constraints for the given database connection.
 */
export async function enableForeignKeys(connection: DatabaseConnection): Promise<void> {
  await connection.executeQuery(CompiledQuery.raw('PRAGMA foreign_keys = ON;'));
}

/**
 * Enables Write-Ahead Logging (WAL) mode for the given database connection.
 */
export async function enableWalMode(connection: DatabaseConnection): Promise<void> {
  await connection.executeQuery(CompiledQuery.raw('PRAGMA journal_mode = WAL;'));
}
