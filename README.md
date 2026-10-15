# AWS Lambda Web Functions POC

A proof-of-concept for [AWS Lambda Web Functions][web-functions]: deploying the same "hello world" app, written in eight
different ways (vanilla `node:http` & seven frameworks), as Web Functions, alongside a regular Lambda (event) function
behind a Function URL for comparison.

Every app serves:

- `GET /` - an index page
- `GET /api` - a JSON response: `{ message, framework, time }`
- `GET /logo.png` - a static image

| App                                    | Framework                                     | Deployed as                                                               |
| -------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| [`apps/basic-event`](apps/basic-event) | None                                          | Lambda (event) function, `AWS::Serverless::Function`, with a Function URL |
| [`apps/express`](apps/express)         | [Express](https://expressjs.com) 5            | Web Function, `AWS::Serverless::WebFunction`                              |
| [`apps/fastify`](apps/fastify)         | [Fastify](https://fastify.dev) 5              | Web Function, `AWS::Serverless::WebFunction`                              |
| [`apps/h3`](apps/h3)                   | [h3](https://h3.dev) 2                        | Web Function, `AWS::Serverless::WebFunction`                              |
| [`apps/hono`](apps/hono)               | [Hono](https://hono.dev)                      | Web Function, `AWS::Serverless::WebFunction`                              |
| [`apps/koa`](apps/koa)                 | [Koa](https://koajs.com) 3                    | Web Function, `AWS::Serverless::WebFunction`                              |
| [`apps/nestjs`](apps/nestjs)           | [NestJS](https://nestjs.com) 12               | Web Function, `AWS::Serverless::WebFunction`                              |
| [`apps/nextjs`](apps/nextjs)           | [Next.js](https://nextjs.org) 16 (App Router) | Web Function, `AWS::Serverless::WebFunction`                              |
| [`apps/vanilla`](apps/vanilla)         | `node:http`                                   | Web Function, `AWS::Serverless::WebFunction`                              |

## Getting started

Tools (Node.js 24, pnpm, AWS CLI, AWS SAM CLI) are managed by [mise](https://mise.jdx.dev):

```sh
$ mise install
$ pnpm install
```

### Run an app locally

Every web app listens on `AWS_LAMBDA_HTTP_ENDPOINT` (`host:port`), the same as on Lambda, and defaults to
`localhost:3000`. (`basic-event` is a handler, not a server, so it has no local dev server.)

```sh
$ cd apps/express
$ pnpm dev
# Or, against the production build
$ pnpm build && pnpm start
# Or, on a different address
$ AWS_LAMBDA_HTTP_ENDPOINT=localhost:4000 pnpm dev
```

## Deploying

Make sure your AWS credentials & region are set (e.g. `AWS_PROFILE` & `AWS_REGION`), then:

```sh
$ mise run deploy
```

This runs [`mise-tasks/deploy`](mise-tasks/deploy), which:

1. Deploys [`infra/base.yml`](infra/base.yml) (stack `lambda-web-function-poc-base`), a versioned S3 bucket with a
   bucket policy that lets Lambda read deployment packages from it, & an IAM execution role shared by every function.
2. Builds every app (`pnpm -r build`) & zips each app into `apps/<app>/function.zip` (`pnpm -r package`).
3. Uploads each zip to `s3://<bucket>/<app>/function.zip`, capturing the new object version.
4. Deploys [`infra/service.yml`](infra/service.yml) (stack `lambda-web-function-poc`) with the bucket, role & object
   versions. SAM uploads `basic-event`'s zip itself, into the same bucket.

Every URL is printed as a stack output (`BasicEventUrl`, `ExpressUrl`, `FastifyUrl`, `H3Url`, `HonoUrl`, `KoaUrl`,
`NestjsUrl`, `NextjsUrl`, `VanillaUrl`).

### Why a separate base stack?

Web Functions can only load code from an object in a **versioned** S3 bucket, and `sam package` can't upload it for
them. So the bucket has to exist (and the zips have to be uploaded) before the main stack can be deployed. See
[Deploying Web Function code from Amazon S3][web-functions-s3].

### Packaging

- **Express, Fastify, h3, Hono, Koa, NestJS & vanilla** - `tsup` bundles each app, dependencies included, into
  `dist/index.js`, so the zip only needs `package.json`, `dist/` & `public/`. The Web Function's `EntryPoint` is
  `dist/index.js`. NestJS is built as a single file (no code splitting), with its optional packages (microservices,
  websockets, validation) left out.
- **Next.js** - built with `output: 'standalone'`. [`lambda.js`](apps/nextjs/lambda.js) is copied in as `index.js`, to
  map `AWS_LAMBDA_HTTP_ENDPOINT` onto the `HOSTNAME` & `PORT` that Next.js reads, before starting `server.js`. The
  `.next/static` & `public` folders are copied in too. The zip keeps symlinks (`zip -y`) because pnpm's standalone
  `node_modules` depends on them.
- **basic-event** - `tsup` builds `dist/handler.js`, zipped with `package.json` & `public/` like the others, which SAM
  uploads. It handles Function URL events directly, returning `/logo.png` as a base64 body.

### Notes

- Every URL is **public**: the Web Function endpoints use `AuthType: ApplicationManaged` & the `basic-event` Function
  URL uses `AuthType: NONE`.
- Every function is limited to a concurrency of 1. `basic-event` has `ReservedConcurrentExecutions: 1`, so one request
  at a time in total. The Web Functions have `MaxConcurrencyPerEnvironment: 1`, so one request at a time per environment
  (`maxEnvironments` can't go below 2, so they still scale out across environments).
- Every deploy uploads new object versions, so every deploy creates a new revision of each Web Function.
- Don't expire or delete old object versions in the bucket: a revision permanently fails if its object version is
  deleted.

### Load testing

Once deployed, run [`test/runner.yml`](test/runner.yml) with [Artillery](https://www.artillery.io) against every URL
output of the service stack:

```sh
$ mise run test
```

Each target's JSON report & full console output is written to `test/artifacts/`, then summarised: status codes, errors &
response times (overall & per route) for every target. Re-print the summary with `mise run test:report`.

Targets are tested one at a time, so they don't compete for your machine's CPU & network and skew each other's response
times. Each takes about 3 minutes, so a full run takes about 27 minutes.

#### Results

From a run on `2026-10-15`, testing one target at a time, with every function limited to a concurrency of 1 (see
[Notes](#notes)):

- **Every Web Function served every request.** All eight returned 100% `200`s across ~4,700 requests each, including the
  50 requests/second spike. With `MaxConcurrencyPerEnvironment: 1`, Lambda scaled out to more environments instead of
  throttling.
- **The Event Function was throttled.** With `ReservedConcurrentExecutions: 1`, 1,013 of its 4,181 requests (24%) got a
  `429`. It also made fewer requests overall, because a virtual user stops at its first failed check.
- **The framework made almost no difference to latency.** All eight Web Functions had a p50 of 12-14ms, a p95 of 20-23ms
  & a p99 of 25-31ms. h3 had the tightest tail (p99 24.8ms) and Next.js the widest (p99 30.9ms), but the whole spread is
  about 6ms.
- **Scaling out didn't show up in the tail.** Even with one request per environment, the spike from 20 to 50 requests a
  second didn't push any Web Function's p99 past 31ms. That fits Lambda starting environments ahead of demand, though
  the test doesn't measure environment counts directly.
- **The Event Function was slower.** Its p50 was 19.9ms against 12-14ms for the Web Functions, and its `/logo.png` was
  slowest (p50 26.8ms), as it returns the image as a base64 body rather than streaming it.
- **Every Web Function had a slow outlier on one route, most likely a cold start.** Next.js had the highest max (901ms,
  on `/api`), then NestJS (573ms), h3 (469ms), Koa (432ms), Express (416ms), Fastify (382ms), vanilla (370ms) & Hono
  (365ms). Each is a single request, so treat them as indicative, not a benchmark. The Event Function's max was only
  69ms, likely because its one environment was already warm.

```
Results (response times in ms)

Target         Result  Requests  Status codes       Errors  VUs failed  p50   p95   p99   Max
-------------  ------  --------  -----------------  ------  ----------  ----  ----  ----  ---
BasicEventUrl  FAIL    4181      200x3168 429x1013  1013    1013        19.9  37.7  46.1  69
VanillaUrl     PASS    4706      200x4706           0       0           12.1  19.9  25.8  370
ExpressUrl     PASS    4722      200x4722           0       0           13.1  22    29.1  416
FastifyUrl     PASS    4712      200x4712           0       0           12.1  19.9  25.8  382
KoaUrl         PASS    4676      200x4676           0       0           13.1  21.1  25.8  432
HonoUrl        PASS    4697      200x4697           0       0           13.1  19.9  25.8  365
H3Url          PASS    4754      200x4754           0       0           12.1  19.9  24.8  469
NextjsUrl      PASS    4665      200x4665           0       0           13.9  22.9  30.9  901
NestjsUrl      PASS    4706      200x4706           0       0           13.1  22.9  29.1  573

Response times by route (p50 / p95 / p99 / max, in ms)

Target         index                     logo                      api
-------------  ------------------------  ------------------------  ------------------------
BasicEventUrl  19.9 / 30.9 / 37.7 / 62   26.8 / 44.3 / 50.9 / 64   19.9 / 30.9 / 37.7 / 69
VanillaUrl     12.1 / 19.9 / 24.8 / 370  13.1 / 19.9 / 24.8 / 45   12.1 / 21.1 / 25.8 / 31
ExpressUrl     13.1 / 23.8 / 30.9 / 416  13.1 / 21.1 / 25.8 / 41   13.1 / 22 / 29.1 / 36
FastifyUrl     12.1 / 21.1 / 24.8 / 44   12.1 / 19.9 / 23.8 / 32   12.1 / 21.1 / 27.9 / 382
KoaUrl         13.1 / 21.1 / 24.8 / 36   13.1 / 19.9 / 24.8 / 37   13.1 / 22 / 25.8 / 432
HonoUrl        12.1 / 19.9 / 25.8 / 365  13.1 / 19.1 / 23.8 / 38   13.1 / 21.1 / 27.9 / 38
H3Url          12.1 / 19.9 / 25.8 / 469  12.1 / 19.1 / 23.8 / 32   12.1 / 19.9 / 24.8 / 35
NextjsUrl      15 / 24.8 / 32.1 / 219    13.1 / 21.1 / 26.8 / 103  13.9 / 24.8 / 29.1 / 901
NestjsUrl      13.1 / 22.9 / 30.9 / 573  13.1 / 22 / 27.9 / 37     13.1 / 22.9 / 27.9 / 43
```

### Tearing down

```sh
$ sam delete --stack-name lambda-web-function-poc
$ sam delete --stack-name lambda-web-function-poc-base
```

The bucket is retained (`DeletionPolicy: Retain`), so empty it (every object version) & delete it manually.

## Layout

```
apps/
  basic-event/      Lambda (event) function
  express/          Web Function: Express
  fastify/          Web Function: Fastify
  h3/               Web Function: h3
  hono/             Web Function: Hono
  koa/              Web Function: Koa
  nestjs/           Web Function: NestJS
  nextjs/           Web Function: Next.js
  vanilla/          Web Function: node:http
infra/
  base.yml          Versioned S3 bucket for deployment packages, & the execution role
  service.yml       The functions (SAM)
mise-tasks/
  deploy            mise run deploy
  test/_default     mise run test
  test/report       mise run test:report
public/
  logo.png          Shared static assets, symlinked into each app as `public/`
mise.toml           Tool versions
samconfig.toml      SAM config, `base` & `default` envs
```

[web-functions]: https://docs.aws.amazon.com/lambda/latest/dg/web-functions.html
[web-functions-s3]: https://docs.aws.amazon.com/lambda/latest/dg/web-functions-code-s3.html
