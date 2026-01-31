/**
 * @module @create-a-npm/index
 * @file index.ts
 * @description 数据中心
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-30 18:44
 * @version 1.1.0
 * @lastModified 2026-01-31 07:55
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
import { exitProgram } from '../utils/index';
import { commandParameters } from './command-parameters';
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
    const merge = function (this: Dependency, list: Dependency) {
      const keys = Object.keys(list);
      keys.forEach(key => (this[key] = devDe?.[key] || list[key]));
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
