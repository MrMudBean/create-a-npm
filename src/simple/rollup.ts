import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**
 *  生成 rollup 打包工具的配置文件信息
 */
export function rollup(): void {
  const { dependencies: de } = dataStore.local;
  const ts = de.includes('typescript');
  const isBin = dataStore.bin === 1;

  writeFileSync(
    dataStore.pkgFile('rollup.config.js'),
    `${ts ? "import typescript from '@rollup/plugin-typescript';" : ''}
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';
import { external } from '@qqi/rollup-external';
${
  isBin
    ? "import license form 'rollup-plugin-license';\nimport terser from '@rollup/plugin-terser';"
    : ''
}

export default {
  input: './src/index.${ts ? 'ts' : 'js'}',
  output: ['es' ${isBin ? '' : ", 'cjs'"} ].map(e => ({
    format: e, // 打包模式
    entryFileNames: '${isBin ? 'bin' : '[name]'}.js', // 打包文件名
    preserveModules: false, // 保留独立模块结构（关键）
    // preserveModulesRoot: 'src', // 保持 src 目录结构
    sourcemap: false, // 正式环境：关闭 source map
    // exports: 'named', // 导出模式
    dir: \`dist/${isBin ? '' : '${e}/'}\`,
  })),
  // 配置需要排除或包含的包
  external: external({
    ignore: ['node:']
  }),
  plugins: [
    resolve(),
    commonjs(),
    json(),${ts ? '\ntypescript(),' : ''}
    cleanup(), ${
      isBin
        ? `\nterser({
      format: {
        comments: false
      }
    }),`
        : ''
    }
    copy({
      targets: [
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),${
      isBin
        ? `\nlicense({
      thirdParty: {
        allow: '(MIT OR Apache-2.0 OR BSD-3-Clause)', // 仅允许这些许可证依赖
        output: {
          file: 'dist/THIRD-PARTY-LICENSES.txt',
          template: dependencies =>
            \`THIRD-PARTY LICENSE\n${'='.repeat(50)}\n\n\`.concat(
              dependencies
                ?.map(
                  dep =>
                    \`\${dep.name} (\${dep.version})\n${'-'.repeat(30)}\n\${dep.licenseText}\n\`,
                )
                .join('\n'),
            ),
        },
      },
    }),`
        : ''
    }
  ],
};`,
  );
}
