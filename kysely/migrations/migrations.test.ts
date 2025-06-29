import { describe, expect, it } from 'bun:test';
import { inlineMigrations } from './utils';
import { CompositeMigrationProvider } from './provider';

describe('CompositeMigrationProvider', () => {
  it('should provide migrations of one provider', async () => {
    const provider1 = inlineMigrations({
      '0001_a': {
        up: async () => {},
        down: async () => {},
      },
      '0002_a': {
        up: async () => {},
        down: async () => {},
      },
      '0003_a': {
        up: async () => {},
        down: async () => {},
      },
    });

    const migrations = await new CompositeMigrationProvider([provider1]).getMigrations();
    expect(Object.keys(migrations)).toEqual(['0001_a', '0002_a', '0003_a']);
  });

  it('should provide migrations of multiple providers', async () => {
    const provider1 = inlineMigrations({
      '0001_a': {
        up: async () => {},
        down: async () => {},
      },
      '0002_a': {
        up: async () => {},
        down: async () => {},
      },
      '0003_a': {
        up: async () => {},
        down: async () => {},
      },
    });

    const provider2 = inlineMigrations({
      '0001_b': {
        up: async () => {},
        down: async () => {},
      },
      '0002_b': {
        up: async () => {},
        down: async () => {},
      },
      '0003_b': {
        up: async () => {},
        down: async () => {},
      },
      '0004_b': {
        up: async () => {},
        down: async () => {},
      },
    });

    const migrations = await new CompositeMigrationProvider([provider1, provider2]).getMigrations();
    expect(Object.keys(migrations)).toEqual(['0001_a', '0002_a', '0003_a', '0001_b', '0002_b', '0003_b', '0004_b']);
  });

  it('should throw when duplicates are found', async () => {
    const provider1 = inlineMigrations({
      '0001_a': {
        up: async () => {},
        down: async () => {},
      },
      '0002_a': {
        up: async () => {},
        down: async () => {},
      },
      '0003_a': {
        up: async () => {},
        down: async () => {},
      },
    });

    const provider2 = inlineMigrations({
      '0001_b': {
        up: async () => {},
        down: async () => {},
      },
      '0002_a': {
        up: async () => {},
        down: async () => {},
      },
      '0003_b': {
        up: async () => {},
        down: async () => {},
      },
      '0004_b': {
        up: async () => {},
        down: async () => {},
      },
    });

    await expect(new CompositeMigrationProvider([provider1, provider2]).getMigrations()).rejects.toThrowError();
  });

  it('should provide migrations of multiple providers in the correct order', async () => {
    const provider1 = inlineMigrations({
      '0001_a': {
        up: async () => {},
        down: async () => {},
      },
      '0002_a': {
        dependencies: ['0001_b'],
        up: async () => {},
        down: async () => {},
      },
      '0003_a': {
        dependencies: ['0003_b'],
        up: async () => {},
        down: async () => {},
      },
    });

    const provider2 = inlineMigrations({
      '0001_b': {
        up: async () => {},
        down: async () => {},
      },
      '0002_b': {
        up: async () => {},
        down: async () => {},
      },
      '0003_b': {
        up: async () => {},
        down: async () => {},
      },
      '0004_b': {
        up: async () => {},
        down: async () => {},
      },
    });

    const migrations = await new CompositeMigrationProvider([provider1, provider2]).getMigrations();
    expect(Object.keys(migrations)).toEqual(['0001_a', '0001_b', '0002_a', '0002_b', '0003_b', '0003_a', '0004_b']);
  });
});
