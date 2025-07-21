import type { GeneratorDialect } from 'kysely-codegen';
import { loadModule } from '../../esm';
import { type Result, error, success } from '../../result';

export async function getGeneratorDialect(
  module?: typeof import('kysely-codegen'),
): Promise<Result<GeneratorDialect, 'missing_dependencies'>> {
  if (!module) {
    const result = await loadModule<typeof import('kysely-codegen')>('kysely-codegen');

    if (!result.success) {
      return error('missing_dependencies');
    }

    module = result.data;
  }

  const adapter = module.SqliteAdapter;

  class BunSqliteGeneratorDialect extends module.SqliteIntrospectorDialect implements GeneratorDialect {
    readonly adapter = new adapter();
  }

  return success(new BunSqliteGeneratorDialect());
}
