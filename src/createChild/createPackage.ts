import { PackageJson } from 'a-node-tools';
import { commandParameters } from '../data-store/command-parameters';
import { FileName } from '../data-store/file-name-enum';
import { dataStore } from '../data-store/index';
import { writeToFile } from '../utils/index';

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
      b: `rollup --config ${FileName.ROLLUP_CONFIG}${ts || dataStore.bin !== 1 ? ` && tsc -p ${FileName.TSCONFIG_TYPES}` : ''}`,
      build: `${manager.value} run b && ${manager.value} run clean:package`,
      test: `jja rm .eg && rollup --config ${FileName.ROLLUP_EG_CONFIG} && node .${FileName.EG_INDEX_JS}`,
      'push:version': 'gvv',
      push: 'gvv',
      diff: 'jja pkg --diff=官方',
      vjj: 'vjj',
      prepublishOnly: 'pjj',
      'clean:package': 'node '.concat(FileName.CLEAN_PACKAGE_JSON),
    },
    license: 'MIT',
  };

  // eslint 脚本
  if (de.includes('eslint')) pkgInfo.scripts.lint = 'jja cls && eslint . --fix';
  // prettier 代码文本格式化
  if (de.includes('prettier'))
    pkgInfo.scripts.beautify = 'jja cls && prettier . --write';

  // 通过这种方法移除 description 属性
  const { description: _, ..._buildPKGInfo } = pkgInfo;

  writeToFile(FileName.PACKAGE_JSON, JSON.stringify(_buildPKGInfo, null, 2));
}
