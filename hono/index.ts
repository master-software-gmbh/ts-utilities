import { loadModule } from '../esm';

export async function getRedirectMiddleware() {
  const result = await loadModule<typeof import('hono/factory')>('hono/factory');

  if (!result.success) {
    throw new Error('Failed to load peer dependency hono/factory');
  }

  const { createMiddleware } = result.data;

  return createMiddleware(async (c, next) => {
    const redirect = c.req.query('redirect');

    if (redirect) {
      await next();

      c.res = undefined;

      c.res = new Response(null, {
        status: 302,
        headers: {
          Location: redirect,
        },
      });

      return;
    }

    return next();
  });
}
