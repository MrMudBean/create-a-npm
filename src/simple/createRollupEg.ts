import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  构建测试打包  */
export function createRollupEg() {
  const { dependencies: de } = dataStore.local;
  const ts = de.includes('typescript');

  writeFileSync(
    dataStore.pkgFile('rollup.config.eg.js'),
    `${ts ? "import typescript from '@rollup/plugin-typescript';" : ''}
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import { external } from '@qqi/rollup-external';

/** 生成  npm 文件的打包配置文件 */
export default {
  input: './eg/index.${ts ? 'ts' : 'js'}',
  output: {
    format: 'es',
    entryFileNames: '[name].mjs',
    preserveModules: false,
    sourcemap: false,
    exports: 'named',
    dir: '.eg/',
  },
  // 配置需要排除的包
  external: external({ ignore: ['node:'] }),
  plugins: [
    resolve(),
    commonjs(),
    // 可打包 json 内容
    json(),
    ${ts ? 'typescript(),' : ''}
    // 去除无用代码
    cleanup(),
  ],
};
  `,
  );
}
