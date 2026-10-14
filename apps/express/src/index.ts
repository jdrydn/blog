import express from 'express';
import path from 'node:path';

// Lambda Web Functions tell the server where to listen, as `host:port`
const [HOST, PORT] = (process.env.AWS_LAMBDA_HTTP_ENDPOINT ?? 'localhost:3000').split(':');
const PUBLIC_DIR = path.resolve(import.meta.dirname, '../public');

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello from Express</title>
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
      <p>Served by Express.</p>
      <p><a href="/api">GET /api</a></p>
    </main>
  </body>
</html>
`;

const app = express();

app.get('/', (_req, res) => {
  res.type('html').send(INDEX_HTML);
});

app.get('/api', (_req, res) => {
  res.json({ message: 'Hello world', framework: 'express', time: new Date().toISOString() });
});

app.use(express.static(PUBLIC_DIR));

app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
