import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'


export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.mjs',
      format: 'es',
      sourcemap: false,
      exports: 'named'
    },
    {
      file: 'lib/index.umd.js',
      name: '@aelita/lune',
      format: 'umd',
      sourcemap: false,
      exports: 'named'
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.esm.json',
      sourceMap: false
    })
  ]
})
