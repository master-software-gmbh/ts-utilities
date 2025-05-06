import type { ExpressionBuilder, ExpressionWrapper, Kysely, Selectable, SqlBool } from 'kysely';
import { type Result, error, success } from '../../result';
import type { ConsentRepository } from '../domain/ConsentRepository';
import { Consent } from '../domain/model/Consent';
import type { DB } from '../infrastructure/types';

export class ConsentRepositoryImpl implements ConsentRepository {
  private readonly database: Kysely<DB>;
  private readonly whereBuilder: (eb: ExpressionBuilder<DB, 'consent'>) => ExpressionWrapper<DB, 'consent', SqlBool>;

  constructor(
    database: Kysely<DB>,
    whereBuilder?: (eb: ExpressionBuilder<DB, 'consent'>) => ExpressionWrapper<DB, 'consent', SqlBool>,
  ) {
    this.database = database;
    this.whereBuilder = whereBuilder ?? ((eb) => eb.and([]));
  }

  bySubject(subject: string): ConsentRepository {
    return new ConsentRepositoryImpl(this.database, (eb) =>
      eb.and([this.whereBuilder(eb), eb('consent.subject', '=', subject)]),
    );
  }

  byPurpose(purpose: string): ConsentRepository {
    return new ConsentRepositoryImpl(this.database, (eb) =>
      eb.and([this.whereBuilder(eb), eb('consent.purpose', '=', purpose)]),
    );
  }

  byStatus(status: string): ConsentRepository {
    return new ConsentRepositoryImpl(this.database, (eb) =>
      eb.and([this.whereBuilder(eb), eb('consent.status', '=', status)]),
    );
  }

  async all(): Promise<Consent[]> {
    const rows = await this.database
      .selectFrom('consent')
      .selectAll()
      .where(this.whereBuilder)
      .orderBy('consent.created_at', 'desc')
      .execute();

    return rows.map(ConsentRepositoryImpl.mapConsent);
  }

  async ofId(_id: string): Promise<Result<Consent, 'entity_doesnt_exist'>> {
    throw new Error('Method not implemented.');
  }

  async save(entity: Consent): Promise<void> {
    return this.database.transaction().execute(async (transaction) => {
      await this.upsert(transaction, entity);
    });
  }

  async add(entity: Consent): Promise<Result<void, 'entity_already_exists'>> {
    return this.database.transaction().execute(async (transaction) => {
      const exists = await this.doesConsentExist(transaction, entity.id);

      if (exists) {
        return error('entity_already_exists');
      }

      await this.upsert(transaction, entity);

      return success();
    });
  }

  async update(_entity: Consent): Promise<Result<void, 'entity_doesnt_exist'>> {
    throw new Error('Method not implemented.');
  }

  async remove(_id: string): Promise<Result<void, 'entity_doesnt_exist'>> {
    throw new Error('Method not implemented.');
  }

  private async upsert(transaction: Kysely<DB>, entity: Consent): Promise<void> {
    await transaction
      .insertInto('consent')
      .values({
        id: entity.id,
        status: entity.status,
        subject: entity.subject,
        purpose: entity.purpose,
        created_at: entity.createdAt.getTime(),
      })
      .onConflict((oc) =>
        oc.doUpdateSet({
          status: entity.status,
          subject: entity.subject,
          purpose: entity.purpose,
          created_at: entity.createdAt.getTime(),
        }),
      )
      .execute();
  }

  private doesConsentExist(transaction: Kysely<DB>, id: string): Promise<boolean> {
    return transaction
      .selectFrom('consent')
      .select('consent.id')
      .where('consent.id', '=', id)
      .execute()
      .then((rows) => rows.length > 0);
  }

  static mapConsent(row: Selectable<DB['consent']>): Consent {
    return new Consent({
      id: row.id,
      status: row.status,
      subject: row.subject,
      purpose: row.purpose,
      createdAt: new Date(row.created_at),
    });
  }
}
