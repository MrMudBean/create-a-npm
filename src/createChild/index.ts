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
  rollup,
  writeToFile,
} from '../utils/index';
import { createPackage } from './createPackage';
import { createRollupEg } from './createRollupEg';

/**    */
export function createChild() {
  const { dependencies: de } = dataStore.local;

  if (de.includes('typescript')) {
    createTsconfig();
    createTsconfigTypes('range');
  }
  rollup('range');
  createRollupEg();
  createReadMe();
  createPackage();
  createLicense();
  createIndex();
  createChangeLog();
  writeToFile('todo.md', '# 代办\n\n');
  createScripts();
  createTest();
}
