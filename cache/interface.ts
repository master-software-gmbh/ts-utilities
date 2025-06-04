export interface Cache<Key = string, Value = string> {
  has(key: Key): Promise<boolean>;
  set(key: Key, value: Value): Promise<void>;
  get(key: Key): Promise<Value | undefined>;
}
