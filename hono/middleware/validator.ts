import type { Env } from 'hono';
import type { Context, MiddlewareHandler, TypedResponse, ValidationTargets } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';

type ValidationTargetKeysWithBody = 'form' | 'json';
type ValidationTargetByMethod<M> = M extends 'get' | 'head' // GET and HEAD request must not have a body content.
  ? Exclude<keyof ValidationTargets, ValidationTargetKeysWithBody>
  : keyof ValidationTargets;

export type ValidationFunction<
  InputType,
  OutputType,
  E extends Env = Record<string, never>,
  P extends string = string,
> = (value: InputType, c: Context<E, P>) => OutputType | Response | Promise<OutputType> | Promise<Response>;

type ExcludeResponseType<T> = T extends Response & TypedResponse<unknown> ? never : T;

const jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
const multipartRegex = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
const urlencodedRegex = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;

// https://github.com/honojs/hono/blob/main/src/validator/validator.ts
export const validator = <
  InputType,
  P extends string,
  M extends string,
  U extends ValidationTargetByMethod<M>,
  OutputType = ValidationTargets[U],
  OutputTypeExcludeResponseType = ExcludeResponseType<OutputType>,
  P2 extends string = P,
  V extends {
    in: {
      [K in U]: K extends 'json'
        ? unknown extends InputType
          ? OutputTypeExcludeResponseType
          : InputType
        : { [K2 in keyof OutputTypeExcludeResponseType]: ValidationTargets[K][K2] };
    };
    out: { [K in U]: OutputTypeExcludeResponseType };
  } = {
    in: {
      [K in U]: K extends 'json'
        ? unknown extends InputType
          ? OutputTypeExcludeResponseType
          : InputType
        : { [K2 in keyof OutputTypeExcludeResponseType]: ValidationTargets[K][K2] };
    };
    out: { [K in U]: OutputTypeExcludeResponseType };
  },
  E extends Env = Record<string, never>,
>(
  target: U,
  validationFunc: ValidationFunction<unknown extends InputType ? ValidationTargets[U] : InputType, OutputType, E, P2>,
): MiddlewareHandler<E, P, V> => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header('Content-Type');

    switch (target) {
      case 'json':
        if (!contentType || !jsonRegex.test(contentType)) {
          break;
        }
        try {
          value = await c.req.json();
        } catch {
          const message = 'Malformed JSON in request body';
          throw new HTTPException(400, { message });
        }
        break;
      case 'form': {
        if (!contentType || !(multipartRegex.test(contentType) || urlencodedRegex.test(contentType))) {
          break;
        }

        value = await c.req.parseBody({
          all: true,
          dot: true,
        });

        break;
      }
      case 'query':
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          }),
        );
        break;
      case 'param':
        value = c.req.param() as Record<string, string>;
        break;
      case 'header':
        value = c.req.header();
        break;
      case 'cookie':
        value = getCookie(c);
        break;
    }

    const res = await validationFunc(value as never, c as never);

    if (res instanceof Response) {
      return res;
    }

    c.req.addValidatedData(target, res as never);

    await next();
  };
};
