import { CompiledQuery, type Expression, sql } from 'kysely';

export class Pragma {
  /**
   * Creates a query to return one row for each database attached to the current database connection. 
   */
  static databaseList(): CompiledQuery {
    return CompiledQuery.raw('PRAGMA database_list;');
  }

  /**
   * Creates a query to set the enforcement of foreign key constraints.
   */
  static foreignKeys(value: 'ON' | 'OFF'): CompiledQuery {
    return CompiledQuery.raw(`PRAGMA foreign_keys = ${value};`);
  }

  /**
   * Creates a query to change the setting of the busy timeout in milliseconds.
   */
  static busyTimeout(value: number): CompiledQuery {
    return CompiledQuery.raw(`PRAGMA busy_timeout = ${value}`);
  }

  /**
   * Creates a query to set the journal mode for databases associated with the current database connection.
   */
  static journalMode(value: 'DELETE' | 'TRUNCATE' | 'PERSIST' | 'MEMORY' | 'WAL' | 'OFF', schema?: string): CompiledQuery {
    if (schema) {
      return CompiledQuery.raw(`PRAGMA "${schema}".journal_mode = ${value};`);
    }

    return CompiledQuery.raw(`PRAGMA journal_mode = ${value};`);
  }

  /**
   * Creates a query to change the setting of the "synchronous" flag.
   */
  static synchronous(value: 'OFF' | 'NORMAL' | 'FULL' | 'EXTRA', schema?: string): CompiledQuery {
    if (schema) {
      return CompiledQuery.raw(`PRAGMA "${schema}".synchronous = ${value};`);
    }

    return CompiledQuery.raw(`PRAGMA synchronous = ${value};`);
  }
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
