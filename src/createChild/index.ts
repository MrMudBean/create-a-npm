import { FileName } from '../data-store/file-name-enum';
import { dataStore } from '../data-store/index';
import {
  createChangeLog,
  createIndex,
  createLicense,
  createReadMe,
  createScripts,
  createTest,
  createTsconfig,
  createTsconfigTypes,
  eslintConfig,
  prettier,
  rollup,
  writeToFile,
} from '../utils/index';
import { createPackage } from './createPackage';
import { createRollupEg } from './createRollupEg';

/**    */
export function createChild() {
  const { dependencies: de } = dataStore.local;
  createPackage();
  if (de.includes('typescript')) {
    createTsconfig();
    createTsconfigTypes();
  }
  rollup();
  createRollupEg();
  createReadMe();
  createLicense();
  createIndex();
  createChangeLog();
  if (de.includes('eslint')) eslintConfig();
  if (de.includes('prettier')) prettier();
  writeToFile(FileName.TODO, '# 代办\n\n');
  createScripts();
  createTest();
}
