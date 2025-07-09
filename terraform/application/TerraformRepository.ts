import type { Kysely, Selectable } from 'kysely';
import type { DB } from './types';
import { TerraformState } from '../domain/model/TerraformState';

export class TerraformRepository {
  private readonly database: Kysely<DB>;

  /**
   * Creates a new repository instance.
   * The Kysely `ParseJSONResultsPlugin` must not be used.
   */
  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  async save(state: TerraformState): Promise<void> {
    await this.database
      .insertInto('terraform_state')
      .values({
        id: state.id,
        name: state.name,
        content: state.content,
        created_at: state.createdAt.getTime(),
        updated_at: state.updatedAt.getTime(),
      })
      .onConflict((oc) =>
        oc.doUpdateSet({
          id: state.id,
          name: state.name,
          content: state.content,
          created_at: state.createdAt.getTime(),
          updated_at: state.updatedAt.getTime(),
        }),
      )
      .execute();
  }

  async findByName(name: string): Promise<TerraformState | null> {
    const row = await this.database
      .selectFrom('terraform_state')
      .selectAll()
      .where('terraform_state.name', '=', name)
      .executeTakeFirst();

    if (!row) {
      return null;
    }

    return TerraformRepository.mapTerraformState(row);
  }

  async deleteByName(name: string): Promise<void> {
    await this.database.deleteFrom('terraform_state').where('terraform_state.name', '=', name).execute();
  }

  static mapTerraformState(row: Selectable<DB['terraform_state']>): TerraformState {
    return new TerraformState({
      id: row.id,
      name: row.name,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
