/**
 * @packageDocumentation
 * @module @create-a-npm/index
 * @file index.ts
 * @description 数据中心
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-30 18:44
 * @version 1.1.0
 * @lastModified 2026-01-16 21:45
 *
 * 当配置包名时，后自动创建包的工作路径
 */
import { enArr } from 'a-js-tools';
import {
  getDirectoryBy,
  initializeFile,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
} from 'a-node-tools';
import { isUndefined } from 'a-type-of-js';
import { DataType } from '../types';
import { dog, dun } from '../utils/dog';
import { commandParameters } from './commandParameters';
import { originDependencies } from './origin-dependencies';

export type Dependency = Record<string, string>;
/** 初始化当前工作文件路径  */
const [__dirname] = initializeFile();

/** 根据当前被调用文件查找当前包的 package.json  文件配置 */
let cwd = getDirectoryBy('package.json', 'file', __dirname);

dog('获取到的地址为', cwd);

/** 这里好像难以避免 cwd 为 undefined */
if (isUndefined(cwd)) {
  cwd = process.cwd();
}

/** 读取当前包的 package.json 文件内容  */
const packageJsonData = readFileToJsonSync<PackageJson>(
  pathJoin(cwd, 'package.json'),
);

dog('获取到的数据为：', packageJsonData);
/** 导出构建数据 */
export const dataStore: DataType = {
  cwd: '',
  range: '',
  pkgFile(...str: string[]): string {
    return pathJoin(this.cwd, ...str);
  },
  rangeFile(...str: string[]): string {
    return pathJoin(this.range, ...str);
  },
  get name(): string {
    return this.package.name;
  },

  set name(name: string) {
    if (this.childPkg) {
      if (this.carryRange) {
        this.range = name.replace(/^@(.*)\/.*$/g, '$1');
        this.cwd = name.replace(/@/, '').replace(/\//, '/packages/');
      } else this.cwd = name.replace(/^.*\/(.*)$/g, '$1');
    } else this.cwd = name;
    this.package.name = name;
  },

  bin: 0,

  local: {
    author: {
      name: '',
      email: '',
      url: '',
    },
    dependencies: originDependencies,
  },

  package: {
    name: '',
    version: '0.0.0',
    description: '',
    author: {
      name: '',
      email: '',
      url: '',
    },
    dependencies: packageJsonData?.dependencies || {},
    devDependencies: packageJsonData?.devDependencies || {},
  },
  install: false,
  carryRange: false,
  childPkg: false,
  buildDevDependencies() {
    const { dependencies: de } = this.local;
    const { devDependencies: devDe } = this.package;

    dog('获取的本地的包信息', de);
    dog('获取本地的');

    const result: Dependency = {};
    /**
     * 通过一种很二的方式来添加
     * @param list 依赖数组
     */
    const merge = function (this: Dependency, list: Dependency) {
      const keys = Object.keys(list);
      keys.forEach(key => (this[key] = devDe[key] || list[key]));
    }.bind(result);

    merge({
      '@eslint/js': '^9.39.2',
      '@qqi/check-version': '^1.1.0',
      '@qqi/rollup-external': '^1.1.0',
      '@rollup/plugin-commonjs': '^29.0.0',
      '@rollup/plugin-json': '^6.1.0',
      '@rollup/plugin-node-resolve': '^16.0.3',
      '@rollup/plugin-terser': '^0.4.4',
      '@rollup/plugin-typescript': '^12.3.0',
      gvv: '^1.0.0',
      jja: '^2.4.0',
      pjj: '^1.0.5',
      rollup: '^4.55.1',
      'rollup-plugin-cleanup': '^3.2.1',
      'rollup-plugin-copy': '^3.5.0',
      vjj: '^1.0.12',
      '@color-pen/static': '^1.1.1',
      '@qqi/log': '^1.0.0',
      'a-command': '^3.0.1',
      'a-js-tools': '^2.0.1',
      'a-node-tools': '^4.4.2',
      'a-type-of-js': '^2.0.0',
      'color-pen': '^3.0.0',
      'colored-table': '^0.2.0',
      qqi: '^1.0.0',
    });

    if (de.includes('husky') && de.includes('prettier')) {
      merge({
        husky: '^9.1.7',
        'lint-staged': '^16.2.7',
      });
    }

    if (de.includes('eslint')) {
      merge({
        // eslint 核心
        eslint: '^9.39.2',
        'eslint-config-prettier': '^10.1.8',
        // 注释文档审视
        'eslint-plugin-jsdoc': '^62.0.0',
        // 其他需要的两个依赖
        globals: '^17.0.0',
        '@eslint/js': '^9.39.2',
        'eslint-plugin-import': '^2.32.0',
        'eslint-plugin-jsonc': '^2.21.0',
        'eslint-plugin-unused-imports': '^4.3.0',
        'eslint-import-resolver-typescript': '^4.4.4',
      });

      // eslint typescript 支持
      if (de.includes('typescript'))
        merge({
          'typescript-eslint': '^8.53.0',
        });

      // eslint prettier 支持
      if (de.includes('prettier'))
        merge({
          'eslint-config-prettier': '^10.1.8',
        });
    }

    // 如果需要格式化
    if (de.includes('prettier'))
      merge({
        prettier: '^3.8.0',
      });

    // 如果需要 ts
    if (de.includes('typescript')) {
      merge({
        '@types/node': '^25.0.9',
        '@rollup/plugin-node-resolve': '^16.0.3',
        typescript: '^5.9.3',
      });
    }
    delete result.merge; // 移除工具函数
    if (dun) {
      dog('构建的依赖图', result);
      dog(
        `构建依赖图（${Object.keys(result).length}）和原版本的 ${Object.keys(devDe).length}`,
      );
      dog(
        '俩者的差集',
        enArr.symmetricDifference(Object.keys(devDe), Object.keys(result)),
      );
    }
    return result;
  },
  commandParameters: commandParameters,
};
