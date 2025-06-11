import type { ExpressionBuilder, ExpressionWrapper, SqlBool } from 'kysely';

export type WhereBuilder<DB, C extends keyof DB> = (eb: ExpressionBuilder<DB, C>) => ExpressionWrapper<DB, C, SqlBool>;
