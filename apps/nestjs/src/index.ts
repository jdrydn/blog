import { Controller, Get, Header, Module, StreamableFile } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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
    <title>Hello from NestJS</title>
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
      <p>Served by NestJS.</p>
      <p><a href="/api">GET /api</a></p>
    </main>
  </body>
</html>
`;

@Controller()
class AppController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  index() {
    return INDEX_HTML;
  }

  @Get('api')
  api() {
    return { message: 'Hello world', framework: 'nestjs', time: new Date().toISOString() };
  }

  @Get('logo.png')
  logo() {
    return new StreamableFile(createReadStream(LOGO_PATH), { type: 'image/png' });
  }
}

@Module({ controllers: [AppController] })
class AppModule {}

const app = await NestFactory.create(AppModule);
await app.listen(Number(PORT), HOST);
console.log(`Listening on http://${HOST}:${PORT}`);
