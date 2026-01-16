import { mkdirSync, writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  创建跟文件的主文件  */
export function createIndex() {
  const { dependencies: de } = dataStore.local;

  /**  是否为 ts  */
  const typescript = de.includes('typescript');
  const isBin = dataStore.bin === 1;

  mkdirSync(dataStore.pkgFile('src'), { recursive: true });

  writeFileSync(
    dataStore.pkgFile(`src/index.${typescript ? 'ts' : 'js'}`),
    isBin
      ? '#!/usr/bin/env node\n\nconsole.log("你好");'
      : `export function sayHello() {
    console.log('哈喽');
  }
  `,
  );
}
