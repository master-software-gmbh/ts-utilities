import { resolve } from 'path';
import { Kysely, type MigrationProvider, Migrator } from 'kysely';
import { type GeneratorDialect, SqliteAdapter, SqliteIntrospectorDialect } from 'kysely-codegen';
import * as codegen from 'kysely-codegen';
import { runMigrations } from '../migration';
import { BunSqliteDialect } from './dialect';

export class BunSqliteGeneratorDialect extends SqliteIntrospectorDialect implements GeneratorDialect {
  readonly adapter = new SqliteAdapter();
}

export async function adHocGeneration(dir: string, provider: MigrationProvider): Promise<void> {
  const db = new Kysely({
    dialect: new BunSqliteDialect({
      url: resolve(dir, 'database.sqlite'),
    }),
  });

  await runMigrations(
    new Migrator({
      db,
      provider,
    }),
  );

  await codegen.generate({
    db,
    dialect: new BunSqliteGeneratorDialect(),
    outFile: resolve(dir, 'types.d.ts'),
  });
}
