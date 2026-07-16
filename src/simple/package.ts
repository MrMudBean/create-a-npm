import type { PackageJson } from '@vvi/node';
import { dataStore } from '../data-store';
import { FileName } from '../data-store/file-name-enum';
import { appendPackageScripts, writeToFile } from '../utils';

/** 生成裸 package.json 文件内容  */
export function packageJson() {
  const pkgInfo: PackageJson<{
    jja?: {
      pkg?: string[]
    }
  }> = {
    name: dataStore.name,
    version: '0.0.0',
    description: '', // 将被移除
    devDependencies: dataStore.buildDevDependencies(),
  };
  appendPackageScripts.call(pkgInfo); // 绑定属性
  const de = dataStore.local.dependencies; // 使用到的依赖 
  const buildJJA = () => {
    if(pkgInfo?.jja?.pkg) 
      return 
    if(pkgInfo?.jja) {
       pkgInfo.jja.pkg = []
       return 
    } 
    pkgInfo.jja = {
      pkg: []
    }
  }
  if (de.includes('eslint')) {
     buildJJA();
     pkgInfo!.jja!.pkg!.push('eslint')
    }
    if (de.includes('typescript')) {
      buildJJA();
      pkgInfo!.jja!.pkg!.push('typescript')
  }

  writeToFile(FileName.PACKAGE_JSON, JSON.stringify(pkgInfo, null, 2));
}
