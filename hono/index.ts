import { loadModule } from '../esm';

export async function getRedirectMiddleware() {
  const result = await loadModule<typeof import('hono/factory')>('hono/factory');

  if (!result.success) {
    throw new Error('Failed to load peer dependency hono/factory');
  }

  const { createMiddleware } = result.data;

  return createMiddleware(async (c, next) => {
    await next();

    const redirect = c.req.query('redirect') ?? c.req.bodyCache.parsedBody?.['redirect'];

    if (typeof redirect === 'string') {
      c.res = undefined;

      c.res = new Response(null, {
        status: 302,
        headers: {
          Location: redirect,
        },
      });

      return;
    }

    return;
  });
}

export * from './middleware/sValidator';
