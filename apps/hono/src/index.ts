import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Lambda Web Functions tell the server where to listen, as `host:port`
const [HOST, PORT] = (process.env.AWS_LAMBDA_HTTP_ENDPOINT ?? 'localhost:3000').split(':');
const LOGO_PATH = path.resolve(import.meta.dirname, '../public/logo.png');

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello from Hono</title>
    <style>
      body { font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; background: #f6f7f9; color: #1f2328; }
      main { text-align: center; }
      img { width: 160px; height: 160px; }
      a { color: #0969da; }
    </style>
  </head>
  <body>
    <main>
      <img src="/logo.png" alt="Logo" />
      <h1>Hello world!</h1>
      <p>Served by Hono.</p>
      <p><a href="/api">GET /api</a></p>
    </main>
  </body>
</html>
`;

const app = new Hono();

app.get('/', (c) => c.html(INDEX_HTML));

app.get('/api', (c) => c.json({ message: 'Hello world', framework: 'hono', time: new Date().toISOString() }));

app.get('/logo.png', async (c) => {
  const logo = await readFile(LOGO_PATH);
  return c.body(logo, 200, { 'Content-Type': 'image/png' });
});

serve({ fetch: app.fetch, hostname: HOST, port: Number(PORT) }, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
