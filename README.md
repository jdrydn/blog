# AWS Lambda Web Functions POC

A proof-of-concept for [AWS Lambda Web Functions][web-functions]: deploying the same "hello world" app, written in eight
different ways (vanilla `node:http` & seven frameworks), as Web Functions, alongside two regular Lambda (event)
functions behind Function URLs for comparison: one handling the event directly & one with [Middy](https://middy.js.org).

Every app serves:

- `GET /` - an index page
- `GET /api` - a JSON response: `{ message, framework, time }`
- `GET /logo.png` - a static image

| App                                    | Framework                                          | Deployed as Lambda                                                  |
| -------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| [`apps/basic-event`](apps/basic-event) | None                                               | Event function, `AWS::Serverless::Function`<br/>With a Function URL |
| [`apps/express`](apps/express)         | [Express](https://expressjs.com) v5                | Web function, `AWS::Serverless::WebFunction`                        |
| [`apps/fastify`](apps/fastify)         | [Fastify](https://fastify.dev) v5                  | Web function, `AWS::Serverless::WebFunction`                        |
| [`apps/h3`](apps/h3)                   | [h3](https://h3.dev) v2                            | Web function, `AWS::Serverless::WebFunction`                        |
| [`apps/hono`](apps/hono)               | [Hono](https://hono.dev) v4                        | Web function, `AWS::Serverless::WebFunction`                        |
| [`apps/koa`](apps/koa)                 | [Koa](https://koajs.com) v3                        | Web function, `AWS::Serverless::WebFunction`                        |
| [`apps/middy`](apps/middy)             | [Middy](https://middy.js.org) v7                   | Event function, `AWS::Serverless::Function`<br/>With a Function URL |
| [`apps/nestjs`](apps/nestjs)           | [NestJS](https://nestjs.com) v12                   | Web function, `AWS::Serverless::WebFunction`                        |
| [`apps/nextjs`](apps/nextjs)           | [Next.js](https://nextjs.org) v16<br/>(App Router) | Web function, `AWS::Serverless::WebFunction`                        |
| [`apps/vanilla`](apps/vanilla)         | `node:http`                                        | Web function, `AWS::Serverless::WebFunction`                        |

## Getting started

Tools (Node.js 24, pnpm, AWS CLI, AWS SAM CLI) are managed by [mise](https://mise.jdx.dev):

```sh
$ mise install
$ pnpm install
```

### Run an app locally

Every web app listens on `AWS_LAMBDA_HTTP_ENDPOINT` (`host:port`), the same as on Lambda, and defaults to
`localhost:3000`. (`basic-event` & `middy` are handlers, not servers, so they have no local dev server.)

```sh
$ cd apps/express
$ pnpm dev
# Or, against the production build
$ pnpm build && pnpm start
# Or, on a different address
$ AWS_LAMBDA_HTTP_ENDPOINT=localhost:4000 pnpm dev
```

## Deploying

Make sure your AWS credentials are set (e.g. `AWS_PROFILE`), then deploy. Everything deploys to & tests from
`us-east-1`, set in [`samconfig.toml`](samconfig.toml) & the `mise-tasks/` scripts:

```sh
$ mise run deploy
```

This runs [`mise-tasks/deploy`](mise-tasks/deploy), which:

1. Deploys [`infra/base.yml`](infra/base.yml) (stack `lambda-web-function-poc-base`), a versioned S3 bucket with a
   bucket policy that lets Lambda read deployment packages from it, & an IAM execution role shared by every function.
2. Builds every app (`pnpm -r build`) & zips each app into `apps/<app>/function.zip` (`pnpm -r package`).
3. Uploads each zip to `s3://<bucket>/<app>/function.zip`, capturing the new object version.
4. Deploys [`infra/service.yml`](infra/service.yml) (stack `lambda-web-function-poc`) with the bucket, role & object
   versions. SAM uploads `basic-event`'s & `middy`'s zips itself, into the same bucket.

Every URL is printed as a stack output:

| Output          | App                                    | Type & Example                                               |
| --------------- | -------------------------------------- | ------------------------------------------------------------ |
| `BasicEventUrl` | [`apps/basic-event`](apps/basic-event) | Event Function URL (`https://$ID.lambda-url.$REGION.on.aws`) |
| `ExpressUrl`    | [`apps/express`](apps/express)         | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |
| `FastifyUrl`    | [`apps/fastify`](apps/fastify)         | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |
| `H3Url`         | [`apps/h3`](apps/h3)                   | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |
| `HonoUrl`       | [`apps/hono`](apps/hono)               | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |
| `KoaUrl`        | [`apps/koa`](apps/koa)                 | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |
| `MiddyUrl`      | [`apps/middy`](apps/middy)             | Event Function URL (`https://$ID.lambda-url.$REGION.on.aws`) |
| `NestjsUrl`     | [`apps/nestjs`](apps/nestjs)           | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |
| `NextjsUrl`     | [`apps/nextjs`](apps/nextjs)           | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |
| `VanillaUrl`    | [`apps/vanilla`](apps/vanilla)         | Web Function URL (`https://$ID.lambda-web.$REGION.on.aws`)   |

### Why a separate base stack?

Web Functions can only load code from an object in a **versioned** S3 bucket, and `sam package` can't upload it for them
(yet!). So the bucket has to exist (and the zips have to be uploaded) before the main stack can be deployed. See
[Deploying Web Function code from Amazon S3][web-functions-s3].

### Why CloudFormation & SAM?

As of `2026-10-16`, only AWS's own infrastructure-as-code tools support Web Functions:

| Tool                 | Supports Web Functions?                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CloudFormation       | Yes (`AWS::Lambda::WebFunction` [docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-lambda-webfunction.html))      |
| AWS SAM              | Yes (`AWS::Serverless::WebFunction` [docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-webfunction.html)) |
| AWS CDK              | Not yet, see [aws/aws-cdk#39234](https://github.com/aws/aws-cdk/issues/39234)                                                                             |
| SST                  | Not yet, see [sst-community/sst#103](https://github.com/sst-community/sst/pull/103)                                                                       |
| Terraform            | Not yet, see [hashicorp/terraform-provider-aws#50429](https://github.com/hashicorp/terraform-provider-aws/issues/50429)                                   |
| Pulumi               | No                                                                                                                                                        |
| Serverless Framework | No                                                                                                                                                        |

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
- **Middy** - the same as `basic-event`, but routed with
  [`@middy/http-router`](https://middy.js.org/docs/routers/http-router), & `tsup` bundles Middy into `dist/handler.js`.

### Notes

- Every URL is **public**: the Web Function endpoints use `AuthType: ApplicationManaged` & the `basic-event` & `middy`
  Function URLs use `AuthType: NONE`.
- Every function runs on (about) 2 Arm vCPUs per environment, so their performance compares evenly, & scales with
  Lambda's defaults (no concurrency limits). The Event Functions (`basic-event` & `middy`) have `MemorySize: 3008`, the
  most a new account allows. That gives them 2 vCPUs, but only about 1.7 vCPUs of compute (Lambda allocates 1 vCPU of
  compute per 1,769 MB), so they're slightly behind the Web Functions. Matching them exactly needs `MemorySize: 3538`,
  after a quota increase from AWS Support.
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
at a time, so they don't skew each other's response times. Each takes about 3 minutes, so a full run takes about 30
minutes.

#### Results

From the latest run on `2026-10-16`, testing one target at a time from Artillery on Lambda in `us-east-1`, the same
region as the functions, with every function on (about) 2 vCPUs per environment & no concurrency limits (see
[Notes](#notes)):

- **Testing from the same region took the network out of the numbers.** Every p50 dropped by about 75ms against the
  previous runs, which were tested from `us-east-1` against functions in another region. What's left is the functions
  themselves, plus a few ms of in-region network.
- **The Web Functions were 2-3x faster than the Event Functions.** Every Web Function had a p50 of 5-6ms, against
  13.9ms for both Event Functions. Their p95s were 15-18ms against 22.9-23.8ms, and their p99s 19.9-29.1ms against
  30.3ms. The gap of about 8ms is much the same as in every previous run, so it doesn't come from CPU, framework or
  network: it's most likely the Function URL & event invocation path, which Web Functions skip.
- **Static files showed the biggest gap.** `/logo.png` was the Web Functions' fastest route (p50 4-5ms, p99 7.9-10.1ms),
  as they stream the file from disk. It was the Event Functions' slowest (p50 16.9ms, p99 32.8-34.1ms), as they return
  it as a base64 body inside a JSON response.
- **The framework made almost no difference to latency.** All eight Web Functions had a p50 of 5-6ms. Hono had the
  tightest p99 (19.9ms) and vanilla the widest (29.1ms). Next.js & NestJS were about 1-2ms behind the rest on `/` &
  `/api` (p50 7ms against 5-6ms), but that's the whole spread at the median.
- **Middy added nothing measurable over a plain handler.** The two Event Functions were all but identical: both had a
  p50 of 13.9ms & a p99 of 30.3ms.
- **Every function served every request.** All ten returned 100% `200`s across ~4,700 requests each, with no `429`s now
  the concurrency limits are gone.
- **`/` & `/api` had wider tails than `/logo.png` on every Web Function** (p95 15-19ms against 6-9ms). Each virtual user
  makes `/` or `/api` as its first request & `/logo.png` as its second, so the logo most likely benefits from an
  already open connection, rather than being cheaper to serve.
- **Most targets had a slow outlier, most likely a cold start.** NestJS had the highest max (588ms, on `/api`), then h3
  (554ms), Express (518ms), Hono (496ms), Koa (485ms), vanilla (478ms), Middy (471ms) & `basic-event` (406ms). Fastify
  (72ms) & Next.js (122ms) had none, as in the previous run. Which targets show one depends on whether a request lands
  on a new environment, so treat them as indicative, not a benchmark.

```
Results (response times in ms)

Target         Result  Requests  Status codes  Errors  VUs failed  p50   p95   p99   Max
-------------  ------  --------  ------------  ------  ----------  ----  ----  ----  ---
BasicEventUrl  PASS    4702      200x4702      0       0           13.9  23.8  30.3  406
MiddyUrl       PASS    4699      200x4699      0       0           13.9  22.9  30.3  471
VanillaUrl     PASS    4711      200x4711      0       0           6     16    29.1  478
ExpressUrl     PASS    4750      200x4750      0       0           5     16    24.8  518
FastifyUrl     PASS    4725      200x4725      0       0           5     18    23.8  72
KoaUrl         PASS    4751      200x4751      0       0           5     16    21.1  485
HonoUrl        PASS    4692      200x4692      0       0           5     16    19.9  496
H3Url          PASS    4661      200x4661      0       0           5     15    21.1  554
NextjsUrl      PASS    4665      200x4665      0       0           6     18    24.8  122
NestjsUrl      PASS    4677      200x4677      0       0           6     16    21.1  588

Response times by route (p50 / p95 / p99 / max, in ms)

Target         index                     logo                      api
-------------  ------------------------  ------------------------  ------------------------
BasicEventUrl  12.1 / 21.1 / 25.8 / 406  16.9 / 25.8 / 34.1 / 68   12.1 / 21.1 / 24.8 / 42
MiddyUrl       12.1 / 19.1 / 23.8 / 50   16.9 / 24.8 / 32.8 / 153  12.1 / 19.1 / 26.8 / 471
VanillaUrl     6 / 16.9 / 30.3 / 45      5 / 7.9 / 10.1 / 30       6 / 18 / 30.9 / 478
ExpressUrl     6 / 18 / 30.3 / 518       5 / 7 / 8.9 / 26          6 / 18 / 27.9 / 47
FastifyUrl     6 / 19.1 / 24.8 / 49      5 / 8.9 / 10.1 / 25       6 / 19.1 / 25.8 / 72
KoaUrl         5 / 16.9 / 22 / 485       4 / 6 / 7.9 / 29          5 / 16.9 / 23.8 / 33
HonoUrl        6 / 16.9 / 21.1 / 56      4 / 7 / 7.9 / 32          6 / 16.9 / 22 / 496
H3Url          5 / 16 / 22 / 554         4 / 7 / 7.9 / 24          5 / 16 / 24.8 / 52
NextjsUrl      7 / 19.1 / 26.8 / 122     5 / 7.9 / 10.1 / 36       7 / 19.1 / 22.9 / 121
NestjsUrl      7 / 18 / 21.1 / 76        5 / 7.9 / 10.1 / 36       7 / 18 / 21.1 / 588
```

### Tearing down

```sh
$ mise run deploy:destroy
```

This runs `sam delete` on the service stack, then the base stack, asking before deleting each one.

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
  middy/            Lambda (event) function: Middy
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
mise.toml           Tool versions & the deploy:destroy task
samconfig.toml      SAM config, `base` & `default` envs
```

[web-functions]: https://docs.aws.amazon.com/lambda/latest/dg/web-functions.html
[web-functions-s3]: https://docs.aws.amazon.com/lambda/latest/dg/web-functions-code-s3.html
