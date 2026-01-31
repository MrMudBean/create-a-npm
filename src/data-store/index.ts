/**
 * @module @create-a-npm/data
 * @file index.ts
 * @description 数据中心
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-30 18:44
 * @version 1.1.0
 * @lastModified 2026-02-01 01:22
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
import { isNull, isUndefined } from 'a-type-of-js';
import { CommandParameters, Dependencies } from '../types';
import { dog, dun } from '../utils/dog';

import { exitProgram } from '../utils/exit-program';
import { commandParameters } from './command-parameters';
import { deLi } from './dependencies-version';
import { FileName } from './file-name-enum';
import { originDependencies } from './origin-dependencies';

export type Dependency = Record<string, string>;
/** 初始化当前工作文件（本包）路径  */
const [__dirname] = initializeFile();

/** 根据当前被调用文件查找当前（本包）包的 package.json  文件配置 */
let cwd = getDirectoryBy(FileName.PACKAGE_JSON, 'file', __dirname);

dog('获取到的地址为', cwd);

/** 这里好像难以避免 cwd 为 undefined */
if (isUndefined(cwd)) {
  cwd = process.cwd();
}

/** 读取当前包的 package.json 文件内容  */
const packageJsonData = readFileToJsonSync<PackageJson>(
  pathJoin(cwd, FileName.PACKAGE_JSON),
);

dog('获取到的数据为：', packageJsonData);
/** 导出构建数据 */
class DataStore {
  /** 工作区目录 */
  packagePath: string = '';
  /**  域名 @xxx/yyy 的 xxx 部分 */
  workSpaceRootPath: string = '';

  /**
   * ## 包构建地址
   * @param str
   */
  pkgFile(...str: string[]): string {
    return pathJoin(this.packagePath, ...str);
  }

  /**
   * 构建工作区的根部分
   * @param str
   */
  rangeFile(...str: string[]): string {
    return pathJoin(this.workSpaceRootPath, ...str);
  }
  /** 隐藏的包名，这样就不用依赖 this.package 了 */
  private _name: string = '';

  /**
   * ## 包名
   *
   * 真实的包名，跟是不是工作区，携带不携带工作区没有任何关系
   *
   * 就是用户输入的实际的包名
   */
  get name(): string {
    return this._name;
  }

  /**
   * @param name  包名
   */
  set name(name: string) {
    this._name = this.package.name = name; // 将包名储存给私有属性
    const match = name.match(/^(@(.+)\/)?(.+)$/);
    if (isNull(match)) {
      exitProgram('未正确识别到包名'); // 没有任何匹配直接退出
    } else {
      // 如果在工作区下（新版本工作区不一定携带域标识 `@`）
      if (this.workspace && this.withRoot) {
        // 这里不应当出现这个问题，但是还是出现了
        if (isUndefined(match[2]) || isUndefined(match[3])) {
          exitProgram('未能正确解析到包名');
        } else {
          this.workSpaceRootPath = match[2] ?? '';
          this.packagePath = `${match[2]}/packages/${match[3]}`;
        }
      } else {
        this.packagePath = match[3] ?? match[0] ?? '';
      }
    }
  }

  /**
   * ## bin 模式
   *
   * - `0` ：纯导出库
   * - `1` ：纯执行库
   * - `2` ：兼容模式
   */
  bin: number = 0;

  local: {
    /** 使用者信息 */
    author: {
      /**
       * ## 用户的姓名
       * 由用户输入设置或读取旧的配置
       */
      name: string;
      /**
       * ## 用户的邮箱
       * 由用户输入或读取旧的配置信息
       */
      email: string;
      /**
       * ## 用户的个人网址
       * 由用户主动输入或读取旧的配置信息
       */
      url: string;
    };
    /** 使用的工具 */
    dependencies: Dependencies[];
  } = {
    author: {
      name: '',
      email: '',
      url: '',
    },
    dependencies: originDependencies,
  };

  /**
   * ## 包数据信息
   *
   * 使用的依赖是本包的版本数据信息
   */
  package: PackageJson<{
    author: {
      name: string;
      email: string;
      url: string;
    };
  }> = {
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
  };
  /** 是否执行安装 */
  install = false;

  /** 是否是工作区 */
  workspace: boolean = false;
  /** 是否携带根（仅限在工作区环境下） */
  withRoot: boolean = false;

  /** 构建测试依赖信息 */
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
    const merge = function (this: Dependency, list: string[]) {
      // 设计冗余，两份数据本就属于同一份数据
      list.forEach(item => (this[item] = devDe?.[item] || deLi[item]));
    }.bind(result);

    merge([
      '@color-pen/static',
      '@eslint/js',
      '@qqi/check-version',
      '@qqi/rollup-external',
      '@rollup/plugin-commonjs',
      '@rollup/plugin-json',
      '@rollup/plugin-node-resolve',
      '@rollup/plugin-terser',
      '@rollup/plugin-typescript',
      'gvv',
      'jja',
      'pjj',
      'rollup',
      'rollup-plugin-cleanup',
      'rollup-plugin-copy',
      'rollup-plugin-typescript2',
      'vjj',
      '@qqi/log',
      'a-command',
      'a-js-tools',
      'a-node-tools',
      'a-type-of-js',
      'color-pen',
      'colored-table',
      'qqi',
    ]);

    if (de.includes('husky') && de.includes('prettier')) {
      merge(['husky', 'lint-staged']);
    }

    if (de.includes('eslint')) {
      merge([
        'eslint',
        'eslint-config-prettier',
        // 注释文档审视
        'eslint-plugin-jsdoc',
        // 其他需要的两个依赖
        'globals',
        '@eslint/js',
        'eslint-plugin-import',
        'eslint-plugin-jsonc',
        'eslint-plugin-unused-imports',
        'eslint-import-resolver-typescript',
      ]);

      // eslint typescript 支持
      if (de.includes('typescript')) merge(['typescript-eslint']);

      // eslint prettier 支持
      if (de.includes('prettier')) merge(['eslint-config-prettier']);
    }

    // 如果需要格式化
    if (de.includes('prettier')) merge(['prettier']);

    // 如果需要 ts
    if (de.includes('typescript'))
      merge(['@types/node', '@rollup/plugin-node-resolve', 'typescript']);

    delete result.merge; // 移除工具函数
    if (dun) {
      dog('构建的依赖图', result);
      dog(
        `构建依赖图（${Object.keys(result).length}）和原版本的 ${Object.keys(devDe ?? {}).length}`,
      );
      dog(
        '俩者的差集',
        enArr.symmetricDifference(
          Object.keys(devDe ?? {}),
          Object.keys(result),
        ),
      );
    }
    return result;
  }
  /** 用户使用命令时传入参数 */
  commandParameters: CommandParameters = commandParameters;
}

export const dataStore = new DataStore();
