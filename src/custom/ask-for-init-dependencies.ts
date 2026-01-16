import { question } from 'a-command';
import { isUndefined } from 'a-type-of-js';
import { dataStore } from '../data-store/index';

/**  询问是否安装依赖  */
export async function askForInitDependencies() {
  const tip = ['安装', '跳过'];
  const result = await question({
    text: '是否安装依赖',
    tip,
  });
  if (isUndefined(result) || result === tip[1]) {
    return;
  }

  dataStore.install = true;
}
