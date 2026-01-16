import { PackageJson } from 'a-node-tools';

export type Dependencies =
  | 'husky'
  | 'action'
  | 'rollup'
  | 'typescript'
  | 'eslint'
  | 'beautify'
  | 'prettier';

/**  本地储存的配置文件数据  */
export type LocalConfig = {
  /**  用户数据  */
  author: {
    /**  用户名  */
    name: string;
    /**  用户邮箱  */
    email: string;
    /**  用户的网站地址  */
    url: string;
  };
  /**  依赖项  */
  dependencies: Dependencies[];
};

export type acceptManagerValue = 'npm' | 'yarn' | 'pnpm' | '';

/**  命令参数解析值  */
export type CommandParameters = {
  /**  nodeJs 的包管理器  */
  manager: {
    value: acceptManagerValue;
    accept: ['npm', 'yarn', 'pnpm'];
  };
};

export type DataType = {
  /** 工作目录 */
  cwd: string;
  /**  边界的目录  */
  range: string;
  /**  创建含边界的外层文件目录  */
  rangeFile(...str: string[]): string;
  /** 创建文件的路径 */
  pkgFile(...str: string[]): string;
  /** 项目名称
   *
   * 该值在 askForName 中进行赋值
   */
  get name(): string;
  /**
   * 设置项目名称
   *
   * @param name 项目名称
   *
   * 该值在 askForName 中进行赋值
   *
   * 赋值时将同时赋值给 package.name
   */
  set name(name: string);
  /** 是否携带 npx 指令
   *
   *  该值将在 custom 过程中进行赋值
   *
   *  - 0 标准库模式
   *  - 1 可执行库模式
   *  - 2 混合模式
   */
  bin: number;
  /**  是否携带范围  */
  carryRange: boolean;
  /**  子包  */
  childPkg: boolean;
  /**  本读的数据  */
  local: LocalConfig;
  /**  nodeJs 包冠霖器  */
  commandParameters: CommandParameters;
  /**  是否安装依赖  */
  install: boolean;
  /** 包中需要的内容  */
  package: PackageJson<{
    author: {
      name: string;
      email: string;
      url: string;
    };
    devDependencies: {
      [x: string]: string;
    };
    dependencies: {
      [x: string]: string;
    };
  }>;
  /**  构建 dev 依赖  */
  buildDevDependencies(): {
    [x: string]: string;
  };
};
