import { dataStore } from '../data-store/index';
import {
  createLicense,
  createTsconfigBase,
  eslintConfig,
  gitIgnore,
  markdown,
  prettier,
  writeToFile,
} from '../utils/index';
import { createAction } from './createAction';
import { createPackage } from './createPackage';
import { createScripts } from './createScripts';

/**  创建边界  */
export function createRange() {
  const { dependencies: de } = dataStore.local;
  if (de.includes('action')) {
    createAction();
    createScripts();
  }
  if (de.includes('typescript')) createTsconfigBase('range');
  createReadMe();
  createPackage();
  createLicense('range');
  if (de.includes('eslint')) eslintConfig('range');
  if (de.includes('prettier')) prettier('range');
  markdown('range');
  gitIgnore('range');
}
/**  构建嵌套的读我  */
function createReadMe() {
  writeToFile(
    'README.md',
    `# 你会更改这里的内容的
    
毕竟，我猜你有很多话要说
记录下来，哪怕不会有人看见
  `,
    'range',
  );
}
