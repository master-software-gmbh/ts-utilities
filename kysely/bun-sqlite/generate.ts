import { resolve } from 'node:path';
import { rm } from 'node:fs/promises';
import { Kysely, type MigrationProvider, Migrator } from 'kysely';
import * as codegen from 'kysely-codegen';
import { runMigrations } from '../migration';
import { BunSqliteDialect } from './dialect';
import { BunSqliteGeneratorDialect } from './generator';

export async function adHocGeneration(dir: string, provider: MigrationProvider): Promise<void> {
  const database = resolve(dir, 'tmp.sqlite');

  const db = new Kysely({
    dialect: new BunSqliteDialect({
      url: database,
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

  await rm(database);
}
