import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  target: 'node24',
  clean: true,
  // Bundle dependencies, so the deployment package doesn't need node_modules
  noExternal: [/.*/],
});
