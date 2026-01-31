import { PackageJson } from 'a-node-tools';
import { dataStore } from '../data-store';
import { commandParameters } from '../data-store/command-parameters';
import { FileName } from '../data-store/file-name-enum';
import { writeToJsonFile } from '../utils';

/** 生成 package.json 文件内容  */
export function packageJson() {
  const { manager } = commandParameters;
  const { dependencies: de } = dataStore.local;
  const ts = de.includes('typescript');

  const pkgInfo: PackageJson<{
    scripts: {
      [x: string]: string;
    };
    devDependencies: {
      [x: string]: string;
    };
    'lint-staged'?: {
      [x: string]: string[];
    };
    type: string;
    private: boolean;
  }> = {
    name: dataStore.name,
    version: '0.0.0',
    type: 'module',
    private: true,
    description: '',
    scripts: {
      b: `rollup --config ${FileName.ROLLUP_CONFIG} ${dataStore.bin !== 1 && ts ? ` && tsc -p ${FileName.TSCONFIG_TYPES}` : ''}`,
      build: `jja cls rm dist && ${manager.value} run b && ${manager.value} run clean:package`,
      'clean:package': 'node '.concat(FileName.CLEAN_PACKAGE_JSON),
      diff: 'jja pkg --diff=淘宝',
      prepublishOnly: 'pjj',
      push: 'gvv',
      'push:version': 'gvv',
      test: `jja rm .eg && rollup --config ${FileName.ROLLUP_EG_CONFIG} && node .${FileName.EG_INDEX_JS}`,
      vjj: 'vjj',
    },
    devDependencies: dataStore.buildDevDependencies(),
  };

  const appendPkgInfo = function (
    // 这里是不安全的，但是涉及到 a-node-tools 包的类型判定
    // 暂时如此处理
    this: Record<string, any>,
    data: Record<string, any>,
    attr: string = 'scripts',
  ) {
    const keys = Object.keys(data);
    keys.forEach(key => {
      if (!this[attr]) this[attr] = {};
      this[attr][key] = data[key];
    });
  }.bind(pkgInfo);

  if (de.includes('husky') && de.includes('prettier')) {
    appendPkgInfo(
      {
        '*.{js,ts}': ['prettier --write'],
      },
      'lint-staged',
    );
    appendPkgInfo({
      prepare: 'husky',
    });
  }

  // eslint 脚本
  if (de.includes('eslint'))
    appendPkgInfo({
      lint: 'jja cls && eslint . --fix',
    });
  // prettier 代码文本格式化
  if (de.includes('prettier'))
    appendPkgInfo({
      beautify: 'jja cls && prettier . --write',
    });

  // 通过这种方法移除 description 属性
  const { description: _, ..._buildPKGInfo } = pkgInfo;
  writeToJsonFile(FileName.PACKAGE_JSON, _buildPKGInfo);
}
