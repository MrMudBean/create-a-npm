import { writeFileSync } from 'node:fs';
import { gitIgnoreText } from '../data-store/gitIgnoreText';
import { dataStore } from '../data-store/index';

/**  写入 gitignore  */
export function gitIgnore() {
  writeFileSync(dataStore.pkgFile('.gitignore'), gitIgnoreText());
}
