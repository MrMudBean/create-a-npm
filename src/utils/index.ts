/**
 * @module @create-a-npm/utils
 * @file index.ts
 * @description 工具函数文件
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-28 12:55
 * @version 1.1.0
 * @lastModified 2026-01-31 08:42
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  _p,
  cursorAfterClear,
  cursorShow,
  typewrite,
  writeJsonFileSync,
} from 'a-node-tools';
import { randomPen } from 'color-pen';
import { dataStore } from '../data-store';
import { commandParameters } from '../data-store/command-parameters';
import { gitIgnoreText } from '../data-store/create-git-ignore-text';
import { createReadMeText } from '../data-store/create-read-me';
import { createScriptCleanPackage } from '../data-store/create-scripts-clean-package';
import {
  createTsconfigBaseText,
  createTsConfigText,
  createTsconfigTypeText,
} from '../data-store/create-tsconfig';
import { eslintText } from '../data-store/eslint-text';
import { FileName } from '../data-store/file-name-enum';
import { licenseText } from '../data-store/licenseText';
import { prettierText } from '../data-store/prettierText';
import { createRollupText } from '../data-store/rollup-text';
import { WriteToFileKind } from '../types';
import { command } from './command';
import { waiting } from './waiting';

/**
 * ## 打印一些内容
 * @param message  {@link  String} 将要打印的信息
 * @returns void
 *
 */
export function printSome(message: string): undefined {
  _p(randomPen(new Date().toLocaleTimeString().concat(message)));
}

/**
 *
 *  写入 json 文件
 *
 * @param fileName  {@link string} 写入的文件名
 * @param jsonData  写入的数据
 * @returns void
 *
 */
export function writeToJsonFile(fileName: string, jsonData: unknown): void {
  writeJsonFileSync(dataStore.pkgFile(fileName), jsonData as never);
}

/**
 * ## 退出程序
 * @param message
 */
export async function exitProgram(
  message: string = '好的，正在做退出前最后的工作，请稍等',
): Promise<never> {
  await typewrite(message);
  waiting.destroyed();
  cursorAfterClear();
  cursorShow();
  return command.end();
}

/**  构建安装  */
export function createCI() {
  const { manager } = commandParameters;
  return manager.value === 'pnpm'
    ? 'pnpm install --frozen-lockfile --prod=false'
    : manager.value + ' ci';
}

/**
 * ## 写入文本
 * @param path 要写入的路径
 * @param text 要写入的文本
 * @param kind 写入的类型
 *  - `pkg` 默认值，写入到简单类型
 *  - `range` 写入到 workspace 的根
 */
export function writeToFile(
  path: string,
  text: string,
  kind: WriteToFileKind = 'pkg',
) {
  writeFileSync(
    dataStore[kind === 'pkg' ? 'pkgFile' : 'rangeFile'](path),
    text,
  );
}

/**
 * 导出 prettier 的相关配置文件
 *
 * @param kind 写入类型
 *
 * 生成包含：
 * - .prettierignore  prettier 执行忽略文件
 * - .prettierrc      prettier 配置文件
 */
export function prettier(kind: WriteToFileKind = 'pkg'): void {
  // 写入 prettier ignore 忽略规则
  writeToFile(FileName.PRETTIER_IGNORE, gitIgnoreText(), kind);

  writeToFile(FileName.PRETTIER, prettierText(), kind);
}

/**
 *  写入 gitignore
 * @param kind 写入的类型
 */
export function gitIgnore(kind: WriteToFileKind = 'pkg') {
  writeToFile(FileName.GIT_IGNORE, gitIgnoreText(), kind);
}

/**
 *  license
 * @param kind 写入的类型
 */
export function createLicense(kind: WriteToFileKind = 'pkg') {
  writeToFile(FileName.LICENSE, licenseText(), kind);
}

/**
 *  markdown
 * @param kind
 */
export function markdown(kind: WriteToFileKind = 'pkg') {
  writeToFile(
    FileName.MARKDOWN_LINT,
    `{
  "MD024": false,
  "MD013": false
}
`,
    kind,
  );
}

/**
 *  eslint 的配置
 * @param kind 写入的类型
 */
export function eslintConfig(kind: WriteToFileKind = 'pkg') {
  writeToFile(FileName.ESLINT_CONFIG, eslintText(), kind);
}

/**  构建读我  */
export function createReadMe() {
  writeToFile(FileName.README, createReadMeText());
}

/**
 *  生成 rollup 打包工具的配置文件信息
 * @param kind 写入的类型
 */
export function rollup(kind: WriteToFileKind = 'pkg'): void {
  writeToFile(FileName.ROLLUP_CONFIG, createRollupText(kind));
}

/**  构建脚本域  */
export function createScripts() {
  writeToFile(FileName.CLEAN_PACKAGE_JSON, createScriptCleanPackage());
}

/**  构建测试  */
export function createTest() {
  const { dependencies: de } = dataStore.local;
  const ts = de.includes('typescript');
  mkdirSync(dataStore.pkgFile('eg'), { recursive: true });
  writeToFile(
    ts ? FileName.EG_INDEX_TS : FileName.EG_INDEX_JS,
    `import { sayHello } from '../src/index';

sayHello(); 
`,
  );
}

/**  添加 change log  */
export function createChangeLog() {
  const time: string = (() => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return `${year}-${month}-${day}`;
  })();
  writeToFile(
    FileName.CHANGE_LOG,
    `# 更新日志 📔

## v0.0.0 (${time})
`,
  );
}

/**  创建跟文件的主文件  */
export function createIndex() {
  const { dependencies: de } = dataStore.local;

  /**  是否为 ts  */
  const typescript = de.includes('typescript');
  const isBin = dataStore.bin === 1;

  mkdirSync(dataStore.pkgFile('src'), { recursive: true });

  writeToFile(
    typescript ? FileName.INDEX_TS : FileName.INDEX_JS,
    isBin
      ? '#!/usr/bin/env node\n\nconsole.log("你好");'
      : `export function sayHello() {
    console.log('哈喽');
  }
  `,
  );
}
/**
 *  构建多层包与 ts 相关的
 * @param kind
 */
export function createTsconfigBase(kind: WriteToFileKind = 'pkg') {
  writeToFile(FileName.TSCONFIG_BASE, createTsconfigBaseText(), kind);
}

/**
 * ## 构建打包类型的 tsconfig 配置项
 * @param kind
 */
export function createTsconfigTypes(kind: WriteToFileKind = 'pkg') {
  if (dataStore.bin !== 1)
    writeToFile(FileName.TSCONFIG_TYPES, createTsconfigTypeText(kind));
}

/**
 * ## 写入标准的 tsconfig.json 文件
 */
export function createTsconfig() {
  writeToFile(
    dataStore.workspace ? FileName.TSCONFIG_ROLLUP : FileName.TSCONFIG,
    createTsConfigText(),
  );
}
