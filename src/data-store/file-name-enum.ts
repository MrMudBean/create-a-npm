/**
 * @packageDocumentation
 * @module @create-a-npm/file-name-enum
 * @file file-name-enum.ts
 * @description _
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-30 18:07
 * @version 1.2.0
 * @lastModified 2026-02-01 01:53
 */

export enum FileName {
  /** 包配置文件名 */
  PACKAGE_JSON = 'package.json',
  /** typescript 配置文件的模版 */
  TSCONFIG_BASE = 'tsconfig.base.json',
  /** 默认构建的默认 tsconfig.json  */
  TSCONFIG = 'tsconfig.json',
  /** 构建用于打包使用的 typescript 配置文件 */
  TSCONFIG_TYPES = 'tsconfig.types.json',
  /** 用户 rollup 打包用的 typescript 配置文件 */
  TSCONFIG_ROLLUP = 'tsconfig.rollup.json',
  /** 主文件 （TS 类型） */
  INDEX_TS = 'src/index.ts',
  /** 主文件 （JS 类型） */
  INDEX_JS = 'src/index.js',
  /** 读我 */
  README = 'README.md',
  /** 版权声明 */
  LICENSE = 'LICENSE',
  /** 更新日志文件 */
  CHANGE_LOG = 'CHANGELOG.md',
  /** git ignore 文件 */
  GIT_IGNORE = '.gitignore',
  /** 测试文件的根 （TS） */
  EG_INDEX_TS = 'eg/index.ts',
  /** 测试文件的根 （JS） */
  EG_INDEX_JS = 'eg/index.js',
  /** 构架主的构建工具 */
  CLEAN_PACKAGE_JSON = 'scripts/clean-package-json.js',
  /** 发布工具 */
  PUB_SH = 'scripts/pub.sh',
  /** 自动从 git diff 中获取当前包的信息 */
  DETECT_CHANGES = 'scripts/detect_changes.sh',
  /** 手动检验发布的包 */
  WORKFLOW_DISPATCH = 'scripts/workflow_dispatch.sh',
  /** 检验当前是否安装了 @qqi/check-version */
  CHECK_VERSION_INSTALL = 'scripts/check_version_install.sh',
  /** CI/CD 目录 */
  CI_CD = '.github/workflows',
  /** CI/CD 发布文件 */
  CI_CD_PUB = '.github/workflows/发布.yml',
  /** rollup 打包文件 */
  ROLLUP_CONFIG = 'rollup.config.js',
  /** rollup 测试打包文件 */
  ROLLUP_EG_CONFIG = 'rollup.config.eg.js',
  /** eslint 配置文件 */
  ESLINT_CONFIG = 'eslint.config.js',
  /** markdown 格式化配置文件 */
  MARKDOWN_LINT = '.markdownlint.json',
  /** prettier 文件 */
  PRETTIER = '.prettierrc',
  /** prettier ignore 文件 */
  PRETTIER_IGNORE = '.prettierignore',
  /** 代办 */
  TODO = 'todo.md',
}
