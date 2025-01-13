import {
  type DatabaseIntrospector,
  type Dialect,
  type DialectAdapter,
  type Driver,
  type Kysely,
  type QueryCompiler,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from 'kysely';
import type { BunSqliteDialectConfig } from './config.ts';
import { BunSqliteDriver } from './driver.ts';

export class BunSqliteDialect implements Dialect {
  constructor(private config: BunSqliteDialectConfig) {}

  createDriver(): Driver {
    return new BunSqliteDriver(this.config);
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createAdapter(): DialectAdapter {
    return new SqliteAdapter();
  }

  createIntrospector(db: Kysely<unknown>): DatabaseIntrospector {
    return new SqliteIntrospector(db);
  }
}
