import { mkdirSync, writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  构建测试  */
export function createTest() {
  const { dependencies: de } = dataStore.local;

  const ts = de.includes('typescript');

  const filePrefix = ts ? 'ts' : 'js';
  mkdirSync(dataStore.pkgFile('eg'), { recursive: true });

  writeFileSync(
    dataStore.pkgFile('eg/index.' + filePrefix),
    `import { sayHello } from '../src/index';

sayHello(); 
`,
  );
}
