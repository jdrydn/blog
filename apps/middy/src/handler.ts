import middy from '@middy/core';
import httpRouterHandler from '@middy/http-router';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Function URL events & responses have the same shape as API Gateway HTTP API (v2) payloads, which Middy's router types
type Event = APIGatewayProxyEventV2;
type Result = APIGatewayProxyResultV2;

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
      <p>Served by Middy, in a Lambda (event) function, through a Function URL.</p>
      <p><a href="/api">GET /api</a></p>
    </main>
  </body>
</html>
`;

const index = middy<Event, Result>().handler(async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
  body: INDEX_HTML,
}));

const api = middy<Event, Result>().handler(async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello world', framework: 'middy', time: new Date().toISOString() }),
}));

const logo = middy<Event, Result>().handler(async () => {
  // Lambda responses are JSON, so binary bodies are returned as base64
  const buffer = await readFile(LOGO_PATH);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'image/png' },
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };
});

export const handler = middy<Event, Result>().handler(
  httpRouterHandler<Event, Result>({
    routes: [
      { method: 'GET', path: '/', handler: index },
      { method: 'GET', path: '/api', handler: api },
      { method: 'GET', path: '/logo.png', handler: logo },
    ],
    // By default, unknown routes throw a 404 error, which needs @middy/http-error-handler to become a response
    notFoundResponse: () => ({
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Not found' }),
    }),
  }),
);
