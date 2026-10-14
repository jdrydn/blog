# CLAUDE.md

Code sample for a blog post: the same "hello world" app in Express, Hono, Next.js & vanilla `node:http`, deployed as AWS
Lambda Web Functions (`AWS::Serverless::WebFunction`), plus `basic-event`, a regular Lambda function. See
[README.md](README.md) for the full picture.

## Commands

```sh
mise install                # Node.js 24, pnpm, AWS CLI, AWS SAM CLI
pnpm install
pnpm -r build               # Build every app
pnpm -r --if-present package  # Zip every web app into apps/<app>/function.zip
mise run deploy             # Bootstrap bucket, build, package, upload & deploy (real AWS resources)

# Per app (apps/express, apps/hono, apps/vanilla, apps/nextjs)
pnpm dev                    # Local dev server on localhost:3000
pnpm build && pnpm start

# Typecheck an app (no typecheck script, use the root TypeScript)
cd apps/<app> && ../../node_modules/.bin/tsc -p .

# Validate templates
sam validate --template-file infra/infrastructure.yml --region <region>
```

There are no tests. To verify a change, build, package & run the app from its unzipped `function.zip` in a directory
with no `node_modules`, with `AWS_LAMBDA_HTTP_ENDPOINT=127.0.0.1:<port>`, then `curl` `/`, `/api` & `/logo.png`.

## Rules

- **Never run `mise run deploy`, `sam deploy` or `sam delete` without asking.** They create or destroy real AWS
  resources.
- **Keep the four web apps in step.** Every web app serves the same three routes (`/`, `/api` returning
  `{ message, framework, time }`, `/logo.png`) with the same index page. A change to one usually belongs in all four.
- `sam validate --lint` fails with `E3006` for the `AWS::Lambda::WebFunction*` types, because cfn-lint doesn't know them
  yet. That's expected, plain `sam validate` is the check.

## Gotchas

- **Listen address**: Web Functions set `AWS_LAMBDA_HTTP_ENDPOINT` (`host:port`), not `PORT`. Every app reads it,
  defaulting to `localhost:3000`. Next.js reads `HOSTNAME` & `PORT`, so `apps/nextjs/lambda.js` maps them before
  requiring the standalone `server.js`.
- **`public/`**: the shared assets live in the root `public/`, symlinked into each app as `apps/<app>/public`. Apps
  resolve it as `path.resolve(import.meta.dirname, '../public')`, which works from both `src/` & `dist/`.
- **Bundling**: Express & Hono bundle their dependencies with tsup (`noExternal`) so the zip needs no `node_modules`
  (pnpm's symlinked `node_modules` can't be zipped as-is). Express is CommonJS, so its bundle gets a `createRequire`
  banner.
- **Next.js zip keeps symlinks** (`zip -y`). Following them breaks pnpm's layout (`Cannot find module '@swc/helpers'`).
- **Web Function code must be in a versioned S3 bucket** (`infra/bootstrap.yml`). `sam package` can't upload it, so
  `mise-tasks/deploy` uploads each zip & passes the object version as a stack parameter (`<App>CodeVersion`).
- **Never delete or expire old object versions** in the code bucket: a revision whose object version is gone fails
  permanently.
- **`CodeUri` paths are relative to the template**, so `infra/infrastructure.yml` uses `../apps/basic-event/dist`.
- **Adding a web app** means: an `apps/<app>` package with `build` & `package` scripts, a `public` symlink
  (`ln -s ../../public apps/<app>/public`), a `<App>CodeVersion` parameter, `AWS::Serverless::WebFunction` & URL output
  in `infra/infrastructure.yml`, and an `upload` line in `mise-tasks/deploy`.

## Conventions

- TypeScript on Node.js 24. Express, Hono & vanilla are ESM (`"type": "module"`) and run directly with Node.js type
  stripping in dev (no `tsx`), so keep syntax erasable (`erasableSyntaxOnly`). `basic-event` builds to CommonJS.
- Prettier: single quotes, 120 columns, trailing commas. 2-space indent.
- Prefer `undefined` over `null`.
- One file per app where possible; the index page HTML is inlined in each app on purpose, so each is self-contained for
  the blog post.
