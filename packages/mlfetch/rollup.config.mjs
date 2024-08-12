// Re: https://github.com/rollup/plugins/issues/1366
import { fileURLToPath } from 'node:url'

import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import rollupReplace from '@rollup/plugin-replace'

const __filename = fileURLToPath(import.meta.url)
globalThis.__filename = __filename

function replace(opts) {
  return rollupReplace({
    ...opts,
    preventAssignment: true,
  })
}

const external = []
const globals = {}
export default [
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
      },
    ],
    plugins: [
      replace({}),
      esbuild(),
      nodeResolve(),
      commonjs(),
    ],
  },
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: 'dist/index.browser.mjs',
        format: 'esm',

      },
    ],
    plugins: [
      replace({}),
      esbuild(),
      nodeResolve(),
      commonjs(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
        globals,
      },
    ],
    plugins: [dts()],
  },
]
