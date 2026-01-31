import { PackageJson } from 'a-node-tools';
import { FileName } from '../data-store/file-name-enum';
import { dataStore } from '../data-store/index';
import { appendPackageScripts, writeToFile } from '../utils/index';

/**  创建包  */
export function createPackage() {
  const pkgInfo: PackageJson = {
    name: dataStore.name.replace(/^@(.*)\/.*$/, '$1') + '-root',
    version: '0.0.0',
    description: '改了这里。毕竟，你有自己的话要说',
    devDependencies: dataStore.buildDevDependencies(),
  };

  appendPackageScripts.call(pkgInfo); // 添加其他属性

  writeToFile(FileName.PACKAGE_JSON, JSON.stringify(pkgInfo, null, 2), 'range');
}
