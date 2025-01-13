import type { DatabaseConnection } from 'kysely';

export type BunSqliteDialectConfig = {
  url?: string;
  extensionsPath?: string;
  onCreateConnection?: (connection: DatabaseConnection) => Promise<void>;
};
