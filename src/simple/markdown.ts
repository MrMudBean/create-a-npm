import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  markdown   */
export function markdown() {
  writeFileSync(
    dataStore.pkgFile('.markdownlint.json'),
    `{
  "MD024": false,
  "MD013": false
}
`,
  );
}
