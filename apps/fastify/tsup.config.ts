import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  target: 'node24',
  clean: true,
  // Bundle dependencies, so the deployment package doesn't need node_modules
  noExternal: [/.*/],
  // Fastify is CommonJS, so give the bundle a `require` for Node.js built-ins
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
});
