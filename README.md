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

Every target is tested at once, so a run takes about 3 minutes. That puts every target's load on your machine & network
at the same time, which can inflate response times: the spike alone is ~450 requests/second, many of them downloading
the 161KB logo.

#### Results

From a run on `2026-10-15`, before Fastify, h3, Koa & NestJS were added, with every function limited to a concurrency of
1 (see [Notes](#notes)):

- **Every Web Function served every request.** All four returned 100% `200`s across ~4,700 requests each, including the
  50 requests/second spike. With `MaxConcurrencyPerEnvironment: 1`, Lambda scaled out to more environments instead of
  throttling.
- **The Event Function was throttled hard.** With `ReservedConcurrentExecutions: 1`, 1,402 of its 4,045 requests (35%)
  got a `429`. It also made fewer requests overall, because a virtual user stops at its first failed check.
- **The framework made almost no difference to warm latency.** All four Web Functions had a p50 of 12-14ms & a p95 of
  18-22ms. Express had the tightest tail (p99 27.9ms), vanilla the widest (p99 53ms).
- **The Event Function was slower even when it succeeded.** Its p50 was 18ms against 12-14ms for the Web Functions, and
  its p99 was ~150ms on every route. Its `/logo.png` was slowest (p50 30.3ms), as it returns the image as a base64 body
  rather than streaming it.
- **The slowest single requests were most likely cold starts.** Next.js had the highest max (797ms, on `/`), then
  Express (499ms, on `/api`), BasicEvent (430ms), Hono (369ms) & vanilla (227ms). Each is a single request, so treat
  them as indicative, not a benchmark.

```
Results (response times in ms)

Target         Result  Requests  Status codes       Errors  VUs failed  p50   p95   p99    Max
-------------  ------  --------  -----------------  ------  ----------  ----  ----  -----  ---
BasicEventUrl  FAIL    4045      200x2643 429x1402  1402    1402        18    43.4  149.9  430
VanillaUrl     PASS    4688      200x4688           0       0           13.1  22    53     227
ExpressUrl     PASS    4666      200x4666           0       0           12.1  18    27.9   499
HonoUrl        PASS    4676      200x4676           0       0           13.1  19.9  34.8   369
NextjsUrl      PASS    4717      200x4717           0       0           13.9  22    39.3   797

Response times by route (p50 / p95 / p99 / max, in ms)

Target         index                     logo                       api
-------------  ------------------------  -------------------------  ------------------------
BasicEventUrl  19.1 / 32.8 / 144 / 157   30.3 / 59.7 / 149.9 / 307  19.1 / 39.3 / 153 / 430
VanillaUrl     13.1 / 22.9 / 56.3 / 130  13.1 / 21.1 / 53 / 227     13.1 / 22 / 48.9 / 99
ExpressUrl     12.1 / 19.1 / 30.3 / 52   12.1 / 16 / 24.8 / 63      12.1 / 18 / 30.3 / 499
HonoUrl        13.1 / 21.1 / 36.2 / 369  13.1 / 18 / 30.9 / 104     13.1 / 21.1 / 34.8 / 114
NextjsUrl      15 / 22.9 / 41.7 / 797    13.1 / 18 / 36.2 / 81      13.9 / 22.9 / 39.3 / 153
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
