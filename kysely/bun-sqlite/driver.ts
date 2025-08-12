import { Database } from 'bun:sqlite';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  CompiledQuery,
  type DatabaseConnection,
  type Driver,
  IdentifierNode,
  type QueryCompiler,
  type QueryResult,
  RawNode,
  SelectQueryNode,
  type TransactionSettings,
  createQueryId,
} from 'kysely';
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

  async beginTransaction(connection: DatabaseConnection, settings: TransactionSettings): Promise<void> {
    if (settings.accessMode === 'read write') {
      await connection.executeQuery(CompiledQuery.raw('begin immediate'));
    } else {
      await connection.executeQuery(CompiledQuery.raw('begin'));
    }
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('commit'));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('rollback'));
  }

  async savepoint(
    connection: DatabaseConnection,
    savepointName: string,
    compileQuery: QueryCompiler['compileQuery'],
  ): Promise<void> {
    await connection.executeQuery(
      compileQuery(this.parseSavepointCommand('savepoint', savepointName), createQueryId()),
    );
  }

  async rollbackToSavepoint(
    connection: DatabaseConnection,
    savepointName: string,
    compileQuery: QueryCompiler['compileQuery'],
  ): Promise<void> {
    await connection.executeQuery(
      compileQuery(this.parseSavepointCommand('rollback to', savepointName), createQueryId()),
    );
  }

  async releaseSavepoint(
    connection: DatabaseConnection,
    savepointName: string,
    compileQuery: QueryCompiler['compileQuery'],
  ): Promise<void> {
    await connection.executeQuery(compileQuery(this.parseSavepointCommand('release', savepointName), createQueryId()));
  }

  async releaseConnection(): Promise<void> {
    this.connectionMutex.unlock();
  }

  async destroy(): Promise<void> {
    logger.info('Closing SQLite database connection');
    this.db?.close();
  }

  private parseSavepointCommand(command: string, savepointName: string): RawNode {
    return RawNode.createWithChildren([
      RawNode.createWithSql(`${command} `),
      IdentifierNode.create(savepointName), // ensures savepointName gets sanitized
    ]);
  }
}

class BunSqliteConnection implements DatabaseConnection {
  readonly #db: Database;

  constructor(db: Database) {
    this.#db = db;
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const { sql, parameters } = compiledQuery;
    const stmt = this.#db.prepare(sql);

    if (stmt.columnNames.length > 0) {
      return {
        rows: stmt.all(parameters as any) as O[],
      }
    } else {
      const { changes, lastInsertRowid } = stmt.run(parameters as any);

      return {
        rows: [],
        numChangedRows: BigInt(changes),
        insertId: BigInt(lastInsertRowid),
      }
    }
  }

  async *streamQuery<R>(compiledQuery: CompiledQuery, _chunkSize: number): AsyncIterableIterator<QueryResult<R>> {
    const { sql, parameters, query } = compiledQuery;
    const stmt = this.#db.prepare(sql);

    if (SelectQueryNode.is(query)) {
      for await (const row of stmt.iterate(parameters as any)) {
        yield { rows: [row as R] }
      }
    } else {
      throw new Error('Sqlite driver only supports streaming of select queries');
    }
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
