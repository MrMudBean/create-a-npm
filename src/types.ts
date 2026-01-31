/** 写入到文件支持的类型 */
export type WriteToFileKind = 'pkg' | 'range';

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
