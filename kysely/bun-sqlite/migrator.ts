import { Migrator, type Kysely } from 'kysely';
import type { MigrationProvider } from '../migrations/types';
import { error, success, type Result } from '../../result';
import { CompositeMigrationProvider } from '../migrations/provider';
import { getErrorMessage } from '../../error';
import { loadModule } from '../../esm';
import { writeFile } from 'node:fs/promises';
import { getGeneratorDialect } from './generator';

export class CompositeMigrator {
  private readonly database: Kysely<any>;
  private readonly providers: MigrationProvider[];

  constructor(database: Kysely<any>, providers: MigrationProvider[]) {
    this.database = database;
    this.providers = providers;
  }

  async migrate(): Promise<Result<void, 'migration_failed'>> {
    const provider = new CompositeMigrationProvider(this.providers);
    const migrator = new Migrator({
      db: this.database,
      provider: provider,
      allowUnorderedMigrations: true,
    });

    const result = await migrator.migrateToLatest();

    if (result.error) {
      return error('migration_failed', getErrorMessage(result.error));
    }

    return success();
  }

  async generate(filepath: string): Promise<Result<void, 'missing_dependencies'>> {
    const { data: module } = await loadModule<typeof import('kysely-codegen')>('kysely-codegen');

    if (!module) {
      return error('missing_dependencies');
    }

    const dialectResult = await getGeneratorDialect(module);

    if (!dialectResult.success) {
      return error(dialectResult.error);
    }

    const result = await module.generate({
      db: this.database,
      dialect: dialectResult.data,
    });

    const content = result.replace(/"/g, "'");

    await writeFile(filepath, content);

    return success();
  }
}
