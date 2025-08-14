import type { DatabaseConnection } from 'kysely';

export type BunSqliteDialectConfig = {
  url?: string;
  onCreateConnection?: (connection: DatabaseConnection) => Promise<void>;

  /**
   * Set a custom path to the SQLite library (macOS only).
   * 
   * Required to load extensions on macOS because it ships with Apple's proprietary build of SQLite, which doesn't support extensions.
   */
  libraryFilepath?: string;

  /**
   * Folder to load SQLite extensions from.
   */
  extensionsFolder?: string;
};
