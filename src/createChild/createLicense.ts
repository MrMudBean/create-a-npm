import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';
import { licenseText } from '../data-store/licenseText';

/**  license  */
export function createLicense() {
  writeFileSync(dataStore.pkgFile('LICENSE'), licenseText());
}
