/**
 * @packageDocumentation
 * @module @create-a-npm/rollup-text
 * @file rollup-text.ts
 * @description _
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-30 07:47
 * @version 1.2.0
 * @lastModified 2026-01-31 07:54
 */

import { WriteToFileKind } from '../types';
import { FileName } from './file-name-enum';
import { dataStore } from './index';

/**
 *
 * @param kind
 */
export function createRollupText(kind: WriteToFileKind) {
  const { dependencies: de } = dataStore.local;
  const ts = de.includes('typescript');
  const isBin = dataStore.bin === 1;

  return `${
    ts
      ? `// import typescript from '@rollup/plugin-typescript';
// 使用更可控的 rollup-plugin-typescript2 代替官插 @rollup/plugin-typescript
import typescript from 'rollup-plugin-typescript2';`
      : ''
  }
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
  input: './${ts ? FileName.INDEX_TS : FileName.INDEX_JS}',
  output: ['es' ${isBin ? '' : ", 'cjs'"} ].map(e => ({
    format: e, // 打包模式
    entryFileNames: '${isBin ? 'bin' : '[name]'}.js', // 打包文件名
    preserveModules: ${isBin}, // 保留独立模块结构（关键）
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
    resolve({
      extensions: ['.js', '.ts', '.jsx', '.tsx'], // 按需添加
    }),
    commonjs(),
    json(),${
      ts
        ? `\ntypescript({
        tsconfig: './${kind === 'pkg' ? FileName.TSCONFIG : FileName.TSCONFIG_ROLLUP}',
        tsconfigOverride: {
        noEmit: true, // 仅允许生成类型文件
        declaration: true,
        emitDeclarationOnly: true,
        importHelpers: false, // 确保不引入 tslib
      },
      clean: true,
    }),`
        : ''
    }
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
};`;
}
