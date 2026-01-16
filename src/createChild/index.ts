import { writeFileSync } from 'node:fs';

import { dataStore } from '../data-store/index';
import { createChangeLog } from './createChangeLog';
import { createIndex } from './createIndex';
import { createLicense } from './createLicense';
import { createPackage } from './createPackage';
import { createReadMe } from './createReadMe';
import { createRollup } from './createRollup';
import { createRollupEg } from './createRollupEg';
import { createScripts } from './createScripts';
import { createTest } from './createTest';
import { createTs } from './createTs';

/**    */
export function createChild() {
  const { dependencies: de } = dataStore.local;

  if (de.includes('typescript')) createTs();
  createRollup();
  createRollupEg();
  createReadMe();
  createPackage();
  createLicense();
  createIndex();
  createChangeLog();
  writeFileSync(dataStore.pkgFile('todo.md'), '# 代办\n\n');
  createScripts();
  createTest();
}
