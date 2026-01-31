import { PackageJson } from 'a-node-tools';
import { FileName } from '../data-store/file-name-enum';
import { dataStore } from '../data-store/index';
import { appendPackageScripts, writeToFile } from '../utils/index';

/**  构建 package.json  */
export function createPackage() {
  const pkgInfo: PackageJson = {
    name: dataStore.name,
    version: '0.0.0',
    description: '写点什么吧，空白只本应存在于虚空',
  };

  appendPackageScripts.call(pkgInfo);

  writeToFile(FileName.PACKAGE_JSON, JSON.stringify(pkgInfo, null, 2));
}
