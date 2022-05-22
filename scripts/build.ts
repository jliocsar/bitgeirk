import { build, BuildOptions } from 'esbuild'

const defaultBuildOptions: BuildOptions = {
  minify: true,
  bundle: true,
  platform: 'node',
}

;(async () => {
  await Promise.all([
    build({
      ...defaultBuildOptions,
      entryPoints: ['./tmp/test.ts'],
      outfile: './out/bundle.js',
    }),
    build({
      ...defaultBuildOptions,
      entryPoints: ['./lib/engine/write/write-worker.ts'],
      outfile: './out/worker.js',
    }),
  ])
})()
