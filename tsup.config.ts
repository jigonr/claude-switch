import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  shims: true,
  splitting: false,
  treeshake: true,
  minify: false,
  banner: {
    js: '#!/usr/bin/env node\n',
  },
});
