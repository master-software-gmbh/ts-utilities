import { Database } from 'bun:sqlite';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { CompiledQuery, type DatabaseConnection, type Driver, type QueryResult } from 'kysely';
import { logger } from '../../logging/index.ts';
import type { BunSqliteDialectConfig } from './config.ts';

export class BunSqliteDriver implements Driver {
  readonly config: BunSqliteDialectConfig;
  readonly connectionMutex = new ConnectionMutex();

  db?: Database;
  connection?: DatabaseConnection;

  constructor(config: BunSqliteDialectConfig) {
    this.config = { ...config };
  }

  async init(): Promise<void> {
    // Set custom SQLite library path for macOS to support loading extensions.
    Database.setCustomSQLite('/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib');

    this.db = new Database(this.config.url);

    if (this.config.extensionsPath) {
      // Load all extensions at the specified folder
      for (const filename of await readdir(this.config.extensionsPath)) {
        const filepath = join(this.config.extensionsPath, filename);
        logger.info(`Loading SQLite extension from ${filepath}`);
        this.db.loadExtension(filepath);
      }
    }

    this.connection = new BunSqliteConnection(this.db);

    if (this.config.onCreateConnection) {
      await this.config.onCreateConnection(this.connection);
    }
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    // SQLite only has one single connection. We use a mutex here to wait
    // until the single connection has been released.
    await this.connectionMutex.lock();
    return this.connection!;
  }

  async beginTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('begin'));
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('commit'));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('rollback'));
  }

  async releaseConnection(): Promise<void> {
    this.connectionMutex.unlock();
  }

  async destroy(): Promise<void> {
    logger.info('Closing SQLite database connection');
    this.db?.close();
  }
}

class BunSqliteConnection implements DatabaseConnection {
  readonly #db: Database;

  constructor(db: Database) {
    this.#db = db;
  }

  executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const { sql, parameters } = compiledQuery;
    const stmt = this.#db.prepare(sql);

    return Promise.resolve({
      rows: stmt.all(parameters as any) as O[],
    });
  }

  async *streamQuery() {
    throw new Error('Streaming query is not supported by SQLite driver.');
  }
}

class ConnectionMutex {
  #promise?: Promise<void>;
  #resolve?: () => void;

  async lock(): Promise<void> {
    while (this.#promise) {
      await this.#promise;
    }

    this.#promise = new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }

  unlock(): void {
    const resolve = this.#resolve;

    this.#promise = undefined;
    this.#resolve = undefined;

    resolve?.();
  }
}
