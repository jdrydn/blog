import Router from '@koa/router';
import Koa from 'koa';
import { createReadStream } from 'node:fs';
import path from 'node:path';

// Lambda Web Functions tell the server where to listen, as `host:port`
const [HOST, PORT] = (process.env.AWS_LAMBDA_HTTP_ENDPOINT ?? 'localhost:3000').split(':');
const LOGO_PATH = path.resolve(import.meta.dirname, '../public/logo.png');

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello from Koa</title>
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
      <p>Served by Koa.</p>
      <p><a href="/api">GET /api</a></p>
    </main>
  </body>
</html>
`;

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.type = 'html';
  ctx.body = INDEX_HTML;
});

router.get('/api', (ctx) => {
  ctx.body = { message: 'Hello world', framework: 'koa', time: new Date().toISOString() };
});

router.get('/logo.png', (ctx) => {
  ctx.type = 'image/png';
  ctx.body = createReadStream(LOGO_PATH);
});

app.use(router.routes());

app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
