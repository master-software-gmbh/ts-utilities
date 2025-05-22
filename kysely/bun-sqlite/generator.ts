import { type GeneratorDialect, SqliteAdapter, SqliteIntrospectorDialect } from 'kysely-codegen';

export class BunSqliteGeneratorDialect extends SqliteIntrospectorDialect implements GeneratorDialect {
  readonly adapter = new SqliteAdapter();
}
