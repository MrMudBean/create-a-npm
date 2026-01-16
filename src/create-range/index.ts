import { writeFileSync } from 'node:fs';
import { eslintText } from '../data-store/eslintText';
import { gitIgnoreText } from '../data-store/gitIgnoreText';
import { dataStore } from '../data-store/index';
import { licenseText } from '../data-store/licenseText';
import { prettierText } from '../data-store/prettierText';
import { createAction } from './createAction';
import { createPackage } from './createPackage';
import { createScripts } from './createScripts';
import { createTs } from './createTs';

/**  创建边界  */
export function createRange() {
  const { dependencies: de } = dataStore.local;
  if (de.includes('action')) {
    createAction();
    createScripts();
  }
  if (de.includes('typescript')) createTs();
  createReadMe();
  createPackage();
  createLicense();
  if (de.includes('eslint')) eslintConfig();
  if (de.includes('prettier')) prettier();
  markdown();
  gitIgnore();
}

/**  写入 gitignore  */
function gitIgnore() {
  writeFileSync(dataStore.rangeFile('.gitignore'), gitIgnoreText());
}

/**  markdown   */
function markdown() {
  writeFileSync(
    dataStore.rangeFile('.markdownlint.json'),
    `{
  "MD024": false,
  "MD013": false
}
`,
  );
}

/**  构建美化  */
function prettier() {
  writeFileSync(dataStore.rangeFile('.prettierrc'), prettierText());

  writeFileSync(dataStore.rangeFile('.prettierignore'), gitIgnoreText());
}

/**  eslint 的配置  */
function eslintConfig() {
  writeFileSync(dataStore.rangeFile('eslint.config.js'), eslintText());
}

/**  构建  */
function createLicense() {
  writeFileSync(dataStore.rangeFile('LICENSE'), licenseText());
}

/**  构建嵌套的读我  */
function createReadMe() {
  writeFileSync(
    dataStore.rangeFile('README.md'),
    `# 你会更改这里的内容的
    
毕竟，我猜你有很多话要说
记录下来，哪怕不会有人看见
  `,
  );
}
