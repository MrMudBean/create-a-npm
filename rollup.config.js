import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';
import { external } from '@qqi/rollup-external';
import license from 'rollup-plugin-license';

export default {
  input: {
    index: './src/bin.ts', // 默认：聚合导出入口
  },
  output: ['es'].map(e => ({
    format: e, // ESM 模式
    entryFileNames: 'bin.js', // 打包文件名
    preserveModules: false, // 保留独立模块结构（关键）
    // preserveModulesRoot: 'src', // 保持 src 目录结构
    sourcemap: false, // 正式环境：关闭 source map
    // exports: 'named', // 导出模式
    dir: `dist/`,
  })),
  // 配置需要排除的包
  external: external({
    include: [
      'a-node-tools',
      'a-type-of-js',
      'color-pen',
      'a-command',
      'a-js-tools',
      '@qqi/log',
      'qqi',
      '@color-pen/static',
      'a-type-of-js/isFunction',
      'a-type-of-js/isNumber',
    ],
    ignore: ['node:'],
  }),
  plugins: [
    resolve(),
    commonjs(),
    // 可打包 json 内容
    json(),
    typescript({}),
    // 去除无用代码
    cleanup(),
    terser({
      format: {
        comments: false, // 移除所有注释
      },
    }),
    copy({
      targets: [
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),
    license({
      thirdParty: {
        allow: '(MIT OR Apache-2.0 OR BSD-3-Clause)', // 仅允许这些许可证依赖
        output: {
          file: 'dist/THIRD-PARTY-LICENSES.txt',
          template: dependencies =>
            `THIRD-PARTY LICENSE\n${'='.repeat(50)}\n\n`.concat(
              dependencies
                ?.map(
                  dep =>
                    `${dep.name} (${dep.version})\n${'-'.repeat(30)}\n${dep.licenseText}\n`,
                )
                .join('\n'),
            ),
        },
      },
    }),
  ],
};
