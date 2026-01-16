import { PackageJson, writeJsonFileSync } from 'a-node-tools';
import { commandParameters } from '../data-store/commandParameters';
import { dataStore } from '../data-store/index';

/**  构建 package.json  */
export function createPackage() {
  const { manager } = commandParameters;

  const { dependencies: de } = dataStore.local;
  const ts = de.includes('typescript');

  const pkgInfo: PackageJson<{
    scripts: {
      [x: string]: string;
    };
    type: 'module';
    version: string;
  }> = {
    type: 'module',
    version: '0.0.0',
    name: dataStore.name,
    description: '写点什么吧，空白只本应存在于虚空',
    scripts: {
      b: `rollup --config rollup.config.js${ts || dataStore.bin !== 1 ? ` && tsc -p tsconfig.types.json` : ''}`,
      build: `${manager.value} run b && ${manager.value} run clean:package`,
      test: 'jja rm .eg && rollup --config rollup.config.eg.js && node .eg/index.mjs',
      'push:version': 'gvv',
      push: 'gvv',
      diff: 'jja pkg --diff=官方',
      vjj: 'vjj',
      prepublishOnly: 'pjj',
      'clean:package': 'node scripts/clean-package-json.js',
    },
    license: 'MIT',
  };

  writeJsonFileSync(dataStore.pkgFile('package.json'), pkgInfo);
}
