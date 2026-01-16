import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  添加 change log  */
export function createChangeLog() {
  const time: string = (() => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return `${year}-${month}-${day}`;
  })();
  writeFileSync(
    dataStore.pkgFile('CHANGELOG.md'),
    `# 更新日志 📔

## v0.0.0 (${time})
`,
  );
}
