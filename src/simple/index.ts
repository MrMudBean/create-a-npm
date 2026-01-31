import { dataStore } from '../data-store/index';
import {
  createChangeLog,
  createIndex,
  createLicense,
  createReadMe,
  createScripts,
  createTest,
  createTsconfig,
  createTsconfigBase,
  createTsconfigTypes,
  eslintConfig,
  gitIgnore,
  markdown,
  prettier,
  rollup,
} from '../utils/index';
import { createAction } from './createAction';
import { createPub } from './createPub';
import { createRollupEg } from './createRollupEg';
import { packageJson } from './package';

/**
 *
 * 导出 package 的主文件
 */
export function packageIndex() {
  const { dependencies: de } = dataStore.local;
  if (de.includes('action')) {
    createAction();
    createPub();
  }
  if (de.includes('typescript')) tsconfigJson();
  rollup();
  createRollupEg();
  createReadMe();
  packageJson();
  createLicense();
  createIndex();
  if (de.includes('eslint')) eslintConfig();
  if (de.includes('prettier')) prettier();
  markdown();
  createChangeLog();
  gitIgnore();
  createScripts();
  createTest();
}
/** 将创建三个 tsconfig 文件的方法合并 */
export function tsconfigJson(): void {
  createTsconfigBase();
  createTsconfig();
  createTsconfigTypes();
}
