export type Primitive = string | number | boolean;

export type NestedRecord = {
  [key: string]: Primitive | NestedRecord;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
