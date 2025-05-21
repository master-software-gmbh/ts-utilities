import { describe, expect, it } from 'bun:test';
import { byId, compose, createLens, get, index as indexLens, set } from './index';

describe('createLens', () => {
  it('should get and set a field on an object', () => {
    type User = { name: string; age: number };
    const user: User = { name: 'Alice', age: 30 };
    const nameLens = createLens<User, 'name'>('name');

    expect(nameLens.get(user)).toBe('Alice');
    const updated = nameLens.set(user, 'Bob');
    expect(updated).toEqual({ name: 'Bob', age: 30 });
  });

  it('should handle missing field gracefully', () => {
    type User = { name?: string };
    const user: User = {};
    const nameLens = createLens<User, 'name'>('name');
    expect(nameLens.get(user)).toBeUndefined();
    const updated = nameLens.set(user, 'Charlie');
    expect(updated).toEqual({ name: 'Charlie' });
  });
});

describe('get and set', () => {
  it('should get and set using a lens', () => {
    const obj = { foo: 1, bar: 2 };
    const fooLens = createLens<typeof obj, 'foo'>('foo');

    expect(get(fooLens, obj)).toBe(1);
    expect(set(fooLens, obj, 42)).toEqual({ foo: 42, bar: 2 });
  });

  it('should not mutate the original object', () => {
    const obj = { foo: 1, bar: 2 };
    const fooLens = createLens<typeof obj, 'foo'>('foo');
    set(fooLens, obj, 100);
    expect(obj.foo).toBe(1);
  });
});

describe('compose', () => {
  it('should compose two lenses', () => {
    type State = { user: { name: string } };
    const state: State = { user: { name: 'Alice' } };
    const userLens = createLens<State, 'user'>('user');
    const nameLens = createLens<State['user'], 'name'>('name');
    const composed = compose(userLens, nameLens);

    expect(composed.get(state)).toBe('Alice');
    const updated = composed.set(state, 'Bob');
    expect(updated).toEqual({ user: { name: 'Bob' } });
  });
});

describe('index lens', () => {
  it('should get and set an array element by index', () => {
    const arr = [10, 20, 30];
    const lens = indexLens<typeof arr>(1);

    expect(lens.get(arr)).toBe(20);
    expect(lens.set(arr, 99)).toEqual([10, 99, 30]);
  });

  it('should return undefined for out-of-bounds index', () => {
    const arr = [1, 2, 3];
    const lens = indexLens<typeof arr>(10);
    expect(lens.get(arr)).toBeUndefined();
  });
});

describe('byId lens', () => {
  it('should get and set an object in array by id', () => {
    const arr = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ];
    const lens = byId<typeof arr>('b');

    expect(lens.get(arr)).toEqual({ id: 'b', value: 2 });

    const updated = lens.set(arr, { id: 'b', value: 42 });
    expect(updated).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 42 },
    ]);
  });

  it('should not modify array if id not found on set', () => {
    const arr = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ];
    const lens = byId<typeof arr>('c');
    const updated = lens.set(arr, { id: 'c', value: 99 });
    expect(updated).toEqual(arr);
  });

  it('should return undefined if id not found on get', () => {
    const arr = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ];
    const lens = byId<typeof arr>('z');
    expect(lens.get(arr)).toBeUndefined();
  });

  it('should handle empty array', () => {
    const arr: { id: string; value: number }[] = [];
    const lens = byId<typeof arr>('a');
    expect(lens.get(arr)).toBeUndefined();
    expect(lens.set(arr, { id: 'a', value: 1 })).toEqual([]);
  });

  it('should handle multiple objects with same id (set updates first)', () => {
    const arr = [
      { id: 'a', value: 1 },
      { id: 'a', value: 2 },
    ];
    const lens = byId<typeof arr>('a');
    const updated = lens.set(arr, { id: 'a', value: 99 });
    expect(updated).toEqual([
      { id: 'a', value: 99 },
      { id: 'a', value: 2 },
    ]);
  });
});
