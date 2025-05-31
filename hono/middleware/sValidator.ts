import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Env, Input, MiddlewareHandler, ValidationTargets } from 'hono';
import { validator } from './validator';

type HasUndefined<T> = undefined extends T ? true : false;

// https://github.com/honojs/middleware/blob/main/packages/standard-validator/src/index.ts
export const sValidator = <
  Schema extends StandardSchemaV1,
  Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
  In = StandardSchemaV1.InferInput<Schema>,
  Out = StandardSchemaV1.InferOutput<Schema>,
  I extends Input = {
    in: HasUndefined<In> extends true
      ? {
          [K in Target]?: In extends ValidationTargets[K] ? In : { [K2 in keyof In]?: ValidationTargets[K][K2] };
        }
      : {
          [K in Target]: In extends ValidationTargets[K] ? In : { [K2 in keyof In]: ValidationTargets[K][K2] };
        };
    out: { [K in Target]: Out };
  },
  V extends I = I,
>(
  target: Target,
  schema: Schema,
): MiddlewareHandler<E, P, V> =>
  // @ts-expect-error not typed well
  validator(target, async (value, c) => {
    const result = await schema['~standard'].validate(value);

    if (result.issues) {
      return c.json({ data: value, error: result.issues, success: false }, 400);
    }

    return result.value as StandardSchemaV1.InferOutput<Schema>;
  });
