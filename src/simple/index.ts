import { createChangeLog } from '../createChild/createChangeLog';
import { createIndex } from '../createChild/createIndex';
import { createLicense } from '../createChild/createLicense';
import { createReadMe } from '../createChild/createReadMe';
import { createScripts } from '../createChild/createScripts';
import { createTest } from '../createChild/createTest';
import { dataStore } from '../data-store/index';
import { createAction } from './createAction';
import { createPub } from './createPub';
import { createRollupEg } from './createRollupEg';
import { eslintConfig } from './eslint';
import { gitIgnore } from './gitIgnore';
import { markdown } from './markdown';
import { packageJson } from './package';
import { prettier } from './prettier';
import { rollup } from './rollup';
import { tsconfigJson } from './tsconfig';

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
