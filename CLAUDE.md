# CLAUDE.md

Code sample for a blog post: the same "hello world" app in Express, Fastify, h3, Hono, Koa, NestJS, Next.js & vanilla
`node:http`, deployed as AWS Lambda Web Functions (`AWS::Serverless::WebFunction`), plus `basic-event`, a regular Lambda
function. See [README.md](README.md) for the full picture.

## Commands

```sh
mise install                # Node.js 24, pnpm, AWS CLI, AWS SAM CLI
pnpm install
pnpm -r build               # Build every app
pnpm -r --if-present package  # Zip every app into apps/<app>/function.zip
mise run deploy             # Deploy base stack, build, package, upload & deploy (real AWS resources)
mise run test                # Artillery (test/runner.yml) against every URL output, results in test/artifacts/
mise run test:report         # Summarise the results in test/artifacts/ again

# Per web app (apps/<app>)
pnpm dev                    # Local dev server on localhost:3000
pnpm build && pnpm start

# Typecheck an app (no typecheck script, use the root TypeScript)
cd apps/<app> && ../../node_modules/.bin/tsc -p .

# Validate templates
sam validate --template-file infra/service.yml --region <region>
```

There are no tests. To verify a change, build, package & run the app from its unzipped `function.zip` in a directory
with no `node_modules`, with `AWS_LAMBDA_HTTP_ENDPOINT=127.0.0.1:<port>`, then `curl` `/`, `/api` & `/logo.png`.

## Rules

- **Never run `mise run deploy`, `sam deploy` or `sam delete` without asking.** They create or destroy real AWS
  resources.
- **Keep every app in step.** Every app (including `basic-event`, through its Function URL) serves the same three routes
  (`/`, `/api` returning `{ message, framework, time }`, `/logo.png`) with the same index page. A change to one usually
  belongs in all of them.
- `sam validate --lint` fails with `E3006` for the `AWS::Lambda::WebFunction*` types, because cfn-lint doesn't know them
  yet. That's expected, plain `sam validate` is the check.

## Gotchas

- **Listen address**: Web Functions set `AWS_LAMBDA_HTTP_ENDPOINT` (`host:port`), not `PORT`. Every web app reads it,
  defaulting to `localhost:3000`. Next.js reads `HOSTNAME` & `PORT`, so `apps/nextjs/lambda.js` maps them before
  requiring the standalone `server.js`.
- **`public/`**: the shared assets live in the root `public/`, symlinked into each app as `apps/<app>/public`. Apps
  resolve it as `path.resolve(import.meta.dirname, '../public')`, which works from both `src/` & `dist/`.
- **Bundling**: every web app except Next.js bundles its dependencies with tsup (`noExternal`) so the zip needs no
  `node_modules` (pnpm's symlinked `node_modules` can't be zipped as-is). Express, Fastify, Koa & NestJS include
  CommonJS, so their bundles get a `createRequire` banner, otherwise they fail with
  `Dynamic require of "events" is not supported`.
- **NestJS bundling**: it must be one file (`splitting: false`), otherwise its decorators run in a shared chunk before
  CommonJS `reflect-metadata` is set up (`Reflect.getOwnMetadata is not a function`). Its optional packages
  (`@nestjs/microservices`, `@nestjs/websockets`, `class-transformer`, `class-validator`) are esbuild `external`s: tsup
  only externalises packages in `package.json`. Its banner aliases `createRequire`, as NestJS's bundle declares one too.
- **Next.js zip keeps symlinks** (`zip -y`). Following them breaks pnpm's layout (`Cannot find module '@swc/helpers'`).
- **Web Function code must be in a versioned S3 bucket** (`infra/base.yml`). `sam package` can't upload it, so
  `mise-tasks/deploy` uploads each zip & passes the object version as a stack parameter (`<App>CodeVersion`).
- **Never delete or expire old object versions** in the code bucket: a revision whose object version is gone fails
  permanently.
- **IAM lives in the base stack**: one execution role (`AWSLambdaBasicExecutionRole`) is shared by every function,
  passed in as `ExecutionRoleArn`. Give it extra permissions in `infra/base.yml`, don't let SAM generate roles in
  `infra/service.yml` (that stack deploys without `CAPABILITY_IAM`).
- **`CodeUri` paths are relative to the template**, so `infra/service.yml` uses `../apps/basic-event/function.zip`.
- **Adding a web app** means: an `apps/<app>` package with `build` & `package` scripts, a `public` symlink
  (`ln -s ../../public apps/<app>/public`), a `<App>CodeVersion` parameter, `AWS::Serverless::WebFunction` & URL output
  in `infra/service.yml`, an `upload` line in `mise-tasks/deploy`, and its `<App>Url` in the list in
  `mise-tasks/test/_default`.

## Conventions

- TypeScript on Node.js 24. Every app except Next.js is ESM (`"type": "module"`). Express, Fastify, h3, Hono, Koa &
  vanilla run directly with Node.js type stripping in dev (no `tsx`), so keep syntax erasable (`erasableSyntaxOnly`).
  NestJS needs decorators (`experimentalDecorators`), which Node.js can't strip, so its `dev` runs `tsup --watch`.
- Prettier: single quotes, 120 columns, trailing commas. 2-space indent.
- Prefer `undefined` over `null`.
- One file per app where possible; the index page HTML is inlined in each app on purpose, so each is self-contained for
  the blog post.
