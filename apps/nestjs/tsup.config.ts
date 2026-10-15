import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  target: 'node24',
  clean: true,
  // One file, so CommonJS `reflect-metadata` is set up before NestJS applies its decorators. With code splitting, the
  // decorators run in a shared chunk before it.
  splitting: false,
  // Bundle dependencies, so the deployment package doesn't need node_modules
  noExternal: [/.*/],
  esbuildOptions(options) {
    // Except the optional packages that NestJS only imports when you use them, which aren't installed
    options.external = ['@nestjs/microservices', '@nestjs/websockets', 'class-transformer', 'class-validator'];
  },
  // Some NestJS dependencies are CommonJS, so give the bundle a `require` for Node.js built-ins
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
  },
});
