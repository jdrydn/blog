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
- Every function is capped at 4 requests at a time, on (about) 2 Arm vCPUs per environment, so the models compare
  evenly. The Web Functions have `ScalingConfig.MaxEnvironments: 2` (the minimum) & `MaxConcurrencyPerEnvironment: 2`,
  so 2 environments x 2 requests. `basic-event` handles one request per environment, so it has
  `ReservedConcurrentExecutions: 4`, and `MemorySize: 3008`, the most a new account allows. That gives it 2 vCPUs, but
  only about 1.7 vCPUs of compute (Lambda allocates 1 vCPU of compute per 1,769 MB), so it's slightly behind the Web
  Functions. Matching them exactly needs `MemorySize: 3538`, after a quota increase from AWS Support.
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

Artillery runs from AWS Lambda in `us-east-1` (`artillery run-lambda`), not your machine, so your CPU & network aren't
the bottleneck. It creates a temporary Lambda function & SQS queue in your account for each run. Targets are tested one
at a time, so they don't skew each other's response times. Each takes about 3 minutes, so a full run takes about 27
minutes.

#### Results

From a run on `2026-10-16`, testing one target at a time from Artillery on Lambda in `us-east-1`, with every function
capped at 4 requests at a time on (about) 2 vCPUs per environment (see [Notes](#notes)):

- **Network distance dominates every number.** Every Web Function had a p50 of 80.6ms, so most of each response time is
  the round trip from Artillery in `us-east-1` to the functions, not the functions themselves. Artillery rounds response
  times into buckets (80.6, 82.3, 83.9, 85.6...), so differences under about 2ms don't show up at all.
- **The framework made almost no difference to latency.** All eight Web Functions had a p50 of 80.6ms, a p95 of
  83.9-85.6ms & a p99 of 89.1-94.6ms. Next.js was the only one consistently a bucket behind (p50 82.3ms on `/` &
  `/api`, & the widest p99 at 94.6ms). The whole spread is about 5ms.
- **Every Web Function served every request, & the Event Function very nearly did.** The Web Functions returned 100%
  `200`s across ~4,700 requests each. The Event Function got 2 `429`s out of 4,707 requests, so its
  `ReservedConcurrentExecutions: 4` was briefly hit, most likely while new environments were cold starting, when each
  request holds an environment for longer.
- **The Event Function was still slower, even with matching compute.** Its p50 was 89.1ms against 80.6ms, a gap of about
  8ms, much the same as the previous run's 6-8ms on 128 MB. So the extra memory didn't close it: it's more likely the
  Function URL & event invocation path than CPU. Its `/logo.png` was again the slowest (p50 92.8ms, p99 165.7ms), as it
  returns the image as a base64 body rather than streaming it.
- **Most targets had a slow outlier, most likely a cold start.** Next.js had the highest max (949ms, on `/`), then
  Express (554ms), Fastify (516ms), Hono (485ms), vanilla (479ms), h3 (472ms), Koa (451ms) & the Event Function
  (359ms). NestJS's max was only 116ms, so no request in the test hit one of its cold starts. Each is a single request,
  so treat them as indicative, not a benchmark.

The previous run (`2026-10-15`), from a laptop, with `basic-event` on 128 MB & `ReservedConcurrentExecutions: 1`, and
the Web Functions on `MaxConcurrencyPerEnvironment: 1` with no limit on environments, had the same shape: the Web
Functions all within ~6ms of each other (p50 12-14ms), & the Event Function slower (p50 19.9ms) and throttled (24% of
requests got a `429`).

```
Results (response times in ms)

Target         Result  Requests  Status codes    Errors  VUs failed  p50   p95   p99    Max
-------------  ------  --------  --------------  ------  ----------  ----  ----  -----  ---
BasicEventUrl  FAIL    4707      200x4705 429x2  2       2           89.1  96.6  106.7  359
VanillaUrl     PASS    4689      200x4689        0       0           80.6  85.6  90.9   479
ExpressUrl     PASS    4663      200x4663        0       0           80.6  85.6  90.9   554
FastifyUrl     PASS    4691      200x4691        0       0           80.6  85.6  89.1   516
KoaUrl         PASS    4726      200x4726        0       0           80.6  85.6  90.9   451
HonoUrl        PASS    4717      200x4717        0       0           80.6  85.6  90.9   485
H3Url          PASS    4677      200x4677        0       0           80.6  85.6  90.9   472
NextjsUrl      PASS    4680      200x4680        0       0           80.6  85.6  94.6   949
NestjsUrl      PASS    4741      200x4741        0       0           80.6  83.9  89.1   116

Response times by route (p50 / p95 / p99 / max, in ms)

Target         index                      logo                        api
-------------  -------------------------  --------------------------  -------------------------
BasicEventUrl  87.4 / 94.6 / 102.5 / 359  92.8 / 100.5 / 165.7 / 179  87.4 / 92.8 / 100.5 / 120
VanillaUrl     80.6 / 85.6 / 92.8 / 479   80.6 / 82.3 / 87.4 / 118    80.6 / 85.6 / 94.6 / 106
ExpressUrl     80.6 / 85.6 / 90.9 / 554   80.6 / 83.9 / 87.4 / 107    80.6 / 85.6 / 92.8 / 101
FastifyUrl     80.6 / 85.6 / 90.9 / 311   80.6 / 82.3 / 89.1 / 125    80.6 / 85.6 / 89.1 / 516
KoaUrl         80.6 / 85.6 / 96.6 / 109   80.6 / 82.3 / 87.4 / 108    80.6 / 85.6 / 89.1 / 451
HonoUrl        80.6 / 85.6 / 92.8 / 485   80.6 / 82.3 / 87.4 / 101    80.6 / 85.6 / 92.8 / 114
H3Url          80.6 / 85.6 / 90.9 / 472   80.6 / 83.9 / 89.1 / 113    80.6 / 85.6 / 90.9 / 127
NextjsUrl      82.3 / 87.4 / 94.6 / 949   80.6 / 83.9 / 89.1 / 106    82.3 / 87.4 / 94.6 / 180
NestjsUrl      80.6 / 85.6 / 92.8 / 116   80.6 / 82.3 / 87.4 / 114    80.6 / 85.6 / 89.1 / 113
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
