import { CompiledQuery, sql, type Expression } from 'kysely';

/**
 * Returns a query that enables foreign key constraints.
 */
export function enableForeignKeys(): CompiledQuery {
  return CompiledQuery.raw('PRAGMA foreign_keys = ON;');
}

/**
 * Returns a query that enables Write-Ahead Logging (WAL) mode.
 */
export function enableWalMode(schema?: string): CompiledQuery {
  if (schema) {
    return CompiledQuery.raw(`PRAGMA "${schema}".journal_mode = WAL;`);
  }

  return CompiledQuery.raw('PRAGMA journal_mode = WAL;');
}

/**
 * Returns a query that lists attached databases.
 */
export function listDatabases(): CompiledQuery {
  return CompiledQuery.raw('PRAGMA database_list;');
}

/**
 * Returns an expression that calculates the Haversine distance between two points.
 * @param lat latitude of the reference point
 * @param lng longitude of the reference point
 * @param latColumn name of the latitude column
 * @param lngColumn name of the longitude column
 */
export function haversineDistance(
  lat: number,
  lng: number,
  latColumn: Expression<number | null>,
  lngColumn: Expression<number | null>,
) {
  return sql<number>`
    6371 * acos(
      cos(radians(${lat}))
      * cos(radians(${latColumn}))
      * cos(radians(${lngColumn}) - radians(${lng}))
      + sin(radians(${lat}))
      * sin(radians(${latColumn}))
    )
  `;
}
