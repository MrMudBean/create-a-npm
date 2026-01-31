import { PackageJson, writeJsonFileSync } from 'a-node-tools';
import { dataStore } from '../data-store/index';

/**  创建包  */
export function createPackage() {
  const { dependencies: de } = dataStore.local;
  const pkgInfo: PackageJson<{
    scripts: {
      [x: string]: string;
    };
    devDependencies: {
      [s: string]: string;
    };
    type: string;
    private: boolean;
    version?: string;
    'lint-staged'?: {
      [x: string]: string[];
    };
  }> = {
    name: dataStore.name.replace(/^@(.*)\/.*$/, '$1') + '-root',
    version: '0.0.0',
    type: 'module',
    private: true,
    description: '改了这里。毕竟，你有自己的话要说',
    scripts: {
      diff: 'jja pkg --diff=官方',
      vjj: 'vjj',
      push: 'gvv',
      'push:version': 'gvv',
      prepublishOnly: 'pjj',
    },
    devDependencies: dataStore.buildDevDependencies(),
  };

  if (de.includes('husky') && de.includes('prettier')) {
    pkgInfo['lint-staged'] = {
      '*.{js,ts}': ['prettier --write'],
    };
    pkgInfo.scripts.prepare = 'husky';
  }

  // eslint 脚本
  if (de.includes('eslint'))
    pkgInfo.scripts['lint'] = 'jja cls && eslint . --fix';

  if (de.includes('prettier'))
    pkgInfo.scripts['beautify'] = 'jja cls && prettier . --write';

  writeJsonFileSync(dataStore.rangeFile('package.json'), pkgInfo);
}
