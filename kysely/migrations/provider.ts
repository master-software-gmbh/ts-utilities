import type { MigrationProvider, Migration } from './types';

/**
 * A migration provider that combines multiple migration providers into a single provider.
 * Migrations are ordered by their dependencies.
 * If multiple providers contain migrations with the same name, an error is thrown.
 */
export class CompositeMigrationProvider implements MigrationProvider {
  private readonly providers: MigrationProvider[];

  constructor(providers: MigrationProvider[]) {
    this.providers = providers;
  }

  async getMigrations(): Promise<Record<string, Migration>> {
    const allMigrations = await this.getAllMigrations();
    const dependencyMap = await this.getDependencyMap();
    const sortedNames = this.topologicalSort(dependencyMap);

    const migrations: Record<string, Migration> = {};

    for (const name of sortedNames) {
      const migration = allMigrations.get(name);

      if (!migration) {
        throw new Error(`Migration not found: ${name}`);
      }

      if (migrations[name]) {
        throw new Error(`Duplicate migration name: ${name}`);
      }

      migrations[name] = migration;
    }

    return migrations;
  }

  private async getAllMigrations(): Promise<Map<string, Migration>> {
    const migrations: Map<string, Migration> = new Map();

    for (const provider of this.providers) {
      const providerMigrations = await provider.getMigrations();

      for (const [name, migration] of Object.entries(providerMigrations)) {
        if (migrations.has(name)) {
          throw new Error(`Duplicate migration name: ${name}`);
        }

        migrations.set(name, migration);
      }
    }

    return migrations;
  }

  private async getDependencyMap(): Promise<Map<string, string[]>> {
    const dependencyMap = new Map<string, string[]>();

    for (const provider of this.providers) {
      const providerMigrations = await provider.getMigrations();
      const addedMigrations: string[] = [];

      for (const [name, migration] of Object.entries(providerMigrations)) {
        // Add entry for migration and its dependencies
        const dependencies = dependencyMap.get(name) ?? [];
        dependencyMap.set(name, dependencies);

        // Add previous migrations from the same provider as dependencies
        for (const addedMigration of addedMigrations) {
          dependencies.push(addedMigration);
        }

        // Add explicit dependencies
        if (migration.dependencies) {
          dependencies.push(...migration.dependencies);
        }

        addedMigrations.push(name);
      }
    }

    return dependencyMap;
  }

  private topologicalSort = (graph: Map<string, string[]>) => {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (node: string) => {
      if (visited.has(node)) {
        return;
      }

      visited.add(node);

      const neighbors = graph.get(node) || [];

      for (const neighbor of neighbors) {
        visit(neighbor);
      }

      result.push(node);
    };

    for (const node of graph.keys()) {
      visit(node);
    }

    return result;
  };
}
