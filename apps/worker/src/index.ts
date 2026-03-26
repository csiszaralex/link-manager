import { Hono } from 'hono';

type Bindings = {
  KV: KVNamespace;
  API_BASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const target = await c.env.KV.get(slug);

  if (!target) return c.text('Not Found', 404);

  // Fire-and-forget — never blocks the redirect
  c.executionCtx.waitUntil(
    fetch(`${c.env.API_BASE_URL}/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        ip:      c.req.header('CF-Connecting-IP'),
        country: c.req.header('CF-IPCountry'),
        city:    c.req.header('CF-IPCity'),
        ua:      c.req.header('User-Agent'),
        ts:      Date.now(),
      }),
    }).catch(() => undefined),
  );

  return c.redirect(target, 301);
});

export default app;
