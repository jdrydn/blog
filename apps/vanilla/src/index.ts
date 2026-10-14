import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

// Lambda Web Functions tell the server where to listen, as `host:port`
const [HOST, PORT] = (process.env.AWS_LAMBDA_HTTP_ENDPOINT ?? 'localhost:3000').split(':');
const LOGO_PATH = path.resolve(import.meta.dirname, '../public/logo.png');

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello from Node.js</title>
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
      <p>Served by a vanilla Node.js HTTP server.</p>
      <p><a href="/api">GET /api</a></p>
    </main>
  </body>
</html>
`;

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(INDEX_HTML);
  } else if (req.method === 'GET' && pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello world', framework: 'vanilla', time: new Date().toISOString() }));
  } else if (req.method === 'GET' && pathname === '/logo.png') {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    createReadStream(LOGO_PATH).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(Number(PORT), HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
