import { writeFileSync } from 'node:fs';
import { eslintText } from '../data-store/eslintText';
import { dataStore } from '../data-store/index';

/**  eslint 的配置  */
export function eslintConfig() {
  writeFileSync(dataStore.pkgFile('eslint.config.mjs'), eslintText());
}
