import type { LambdaFunctionURLEvent, LambdaFunctionURLResult } from 'aws-lambda';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const LOGO_PATH = path.resolve(import.meta.dirname, '../public/logo.png');

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello from Lambda</title>
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
      <p>Served by a Lambda (event) function, through a Function URL.</p>
      <p><a href="/api">GET /api</a></p>
    </main>
  </body>
</html>
`;

export async function handler(event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> {
  const { method } = event.requestContext.http;
  const pathname = event.rawPath;

  if (method === 'GET' && pathname === '/') {
    return { statusCode: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }, body: INDEX_HTML };
  } else if (method === 'GET' && pathname === '/api') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello world', framework: 'basic-event', time: new Date().toISOString() }),
    };
  } else if (method === 'GET' && pathname === '/logo.png') {
    // Lambda responses are JSON, so binary bodies are returned as base64
    const logo = await readFile(LOGO_PATH);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: logo.toString('base64'),
      isBase64Encoded: true,
    };
  } else {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Not found' }),
    };
  }
}
