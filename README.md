# AWS Lambda Web Functions POC

A proof-of-concept for [AWS Lambda Web Functions][web-functions]: deploying the same "hello world" app, written in four
different Node.js web frameworks, as Web Functions, alongside a regular Lambda (event) function for comparison.

Each web app serves:

- `GET /` - an index page
- `GET /api` - a JSON response: `{ message, framework, time }`
- `GET /logo.png` - a static image

| App                                    | Framework                                     | Deployed as                                          |
| -------------------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| [`apps/basic-event`](apps/basic-event) | None                                          | Lambda (event) function, `AWS::Serverless::Function` |
| [`apps/express`](apps/express)         | [Express](https://expressjs.com) 5            | Web Function, `AWS::Serverless::WebFunction`         |
| [`apps/hono`](apps/hono)               | [Hono](https://hono.dev)                      | Web Function, `AWS::Serverless::WebFunction`         |
| [`apps/nextjs`](apps/nextjs)           | [Next.js](https://nextjs.org) 16 (App Router) | Web Function, `AWS::Serverless::WebFunction`         |
| [`apps/vanilla`](apps/vanilla)         | `node:http`                                   | Web Function, `AWS::Serverless::WebFunction`         |

## Getting started

Tools (Node.js 24, pnpm, AWS CLI, AWS SAM CLI) are managed by [mise](https://mise.jdx.dev):

```sh
$ mise install
$ pnpm install
```

### Run an app locally

Every web app listens on `AWS_LAMBDA_HTTP_ENDPOINT` (`host:port`), the same as on Lambda, and defaults to
`localhost:3000`:

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

1. Deploys [`infra/bootstrap.yml`](infra/bootstrap.yml) (stack `lambda-web-function-poc-bootstrap`), a versioned S3
   bucket with a bucket policy that lets Lambda read deployment packages from it.
2. Builds every app (`pnpm -r build`) & zips each web app into `apps/<app>/function.zip` (`pnpm -r package`).
3. Uploads each zip to `s3://<bucket>/<app>/function.zip`, capturing the new object version.
4. Deploys [`infra/infrastructure.yml`](infra/infrastructure.yml) (stack `lambda-web-function-poc`) with those object
   versions. SAM packages `basic-event` itself, into the same bucket.

The web app URLs are printed as stack outputs (`ExpressUrl`, `HonoUrl`, `NextjsUrl`, `VanillaUrl`).

### Why a separate bootstrap stack?

Web Functions can only load code from an object in a **versioned** S3 bucket, and `sam package` can't upload it for
them. So the bucket has to exist (and the zips have to be uploaded) before the main stack can be deployed. See
[Deploying Web Function code from Amazon S3][web-functions-s3].

### Packaging

- **Express, Hono & vanilla** - `tsup` bundles each app, dependencies included, into `dist/index.js`, so the zip only
  needs `package.json`, `dist/` & `public/`. The Web Function's `EntryPoint` is `dist/index.js`.
- **Next.js** - built with `output: 'standalone'`. [`lambda.js`](apps/nextjs/lambda.js) is copied in as `index.js`, to
  map `AWS_LAMBDA_HTTP_ENDPOINT` onto the `HOSTNAME` & `PORT` that Next.js reads, before starting `server.js`. The
  `.next/static` & `public` folders are copied in too. The zip keeps symlinks (`zip -y`) because pnpm's standalone
  `node_modules` depends on them.
- **basic-event** - `tsup` builds a CommonJS `dist/handler.js`, which SAM zips & uploads.

### Notes

- The Web Function endpoints use `AuthType: ApplicationManaged`, so they're **public**.
- Every deploy uploads new object versions, so every deploy creates a new revision of each Web Function.
- Don't expire or delete old object versions in the bucket: a revision permanently fails if its object version is
  deleted.
- `basic-event` has no trigger, invoke it directly with `aws lambda invoke`.

### Tearing down

```sh
$ sam delete --stack-name lambda-web-function-poc
$ sam delete --stack-name lambda-web-function-poc-bootstrap
```

The bucket is retained (`DeletionPolicy: Retain`), so empty it (every object version) & delete it manually.

## Layout

```
apps/
  basic-event/      Lambda (event) function
  express/          Web Function: Express
  hono/             Web Function: Hono
  nextjs/           Web Function: Next.js
  vanilla/          Web Function: node:http
infra/
  bootstrap.yml     Versioned S3 bucket for deployment packages
  infrastructure.yml  The functions (SAM)
mise-tasks/
  deploy            mise run deploy
public/
  logo.png          Shared static assets, symlinked into each app as `public/`
mise.toml           Tool versions
samconfig.toml      SAM config, `bootstrap` & `default` envs
```

[web-functions]: https://docs.aws.amazon.com/lambda/latest/dg/web-functions.html
[web-functions-s3]: https://docs.aws.amazon.com/lambda/latest/dg/web-functions-code-s3.html
