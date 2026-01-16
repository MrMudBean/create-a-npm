import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**    */
export function createRollup() {
  const { dependencies: de } = dataStore.local;

  const typescript = de.includes('typescript');
  const mark = '+++++';
  writeFileSync(
    dataStore.pkgFile('rollup.config.js'),
    `${typescript ? "import typescript from '@rollup/plugin-typescript';" : mark}
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';
import { external } from '@qqi/rollup-external';

export default {
  input: './index.${typescript ? 'ts' : 'js'}',
  output: 
    ${
      dataStore.bin !== 1
        ? `[{
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      sourcemap: false,
      exports: 'named',
      dir: 'dist/',
    },{
        format: 'cjs',
        entryFileNames: '[name].cjs',
        preserveModules: true,
        sourcemap: false,
        exports: 'named',
        dir: 'dist/',
      },],`
        : `{
       format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: false,
      sourcemap: false,
      exports: 'named',
      dir: 'dist/',
   },`
    }
  // 配置需要排除的或包含包
  external: external(),
  plugins: [
    resolve(),
    commonjs(),
    json(),
    ${
      typescript
        ? `typescript({
        tsconfig: './tsconfig.rollup.json',
        exclude: ['node_modules', 'test'],
      }),`
        : '+++'
    }
    // 去除无用代码
    cleanup(),
    copy({
      targets: [
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),
  ],
};
`.replace(/\+{2,}\n?/gm, ''),
  );
}
