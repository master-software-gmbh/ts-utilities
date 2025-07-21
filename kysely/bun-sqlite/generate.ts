import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Kysely, type MigrationProvider, Migrator } from 'kysely';
import { loadModule } from '../../esm';
import { type Result, error, success } from '../../result';
import { runMigrations } from '../migrations/utils';
import { BunSqliteDialect } from './dialect';
import { getGeneratorDialect } from './generator';

export async function adHocGeneration(
  dir: string,
  provider: MigrationProvider,
): Promise<Result<void, 'missing_dependencies'>> {
  const { data: module } = await loadModule<typeof import('kysely-codegen')>('kysely-codegen');

  if (!module) {
    return error('missing_dependencies');
  }

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

  const dialectResult = await getGeneratorDialect(module);

  if (!dialectResult.success) {
    return error(dialectResult.error);
  }

  await module.generate({
    db,
    dialect: dialectResult.data,
    outFile: resolve(dir, 'types.d.ts'),
  });

  await rm(database);

  return success();
}
