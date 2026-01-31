import { PackageJson } from 'a-node-tools';
import { dataStore } from '../data-store';
import { FileName } from '../data-store/file-name-enum';
import { appendPackageScripts, writeToFile } from '../utils';

/** 生成 package.json 文件内容  */
export function packageJson() {
  const pkgInfo: PackageJson = {
    name: dataStore.name,
    version: '0.0.0',
    description: '', // 将被移除
    devDependencies: dataStore.buildDevDependencies(),
  };
  appendPackageScripts.call(pkgInfo); // 绑定属性

  writeToFile(FileName.PACKAGE_JSON, JSON.stringify(pkgInfo, null, 2));
}
