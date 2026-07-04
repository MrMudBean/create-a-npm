/**
 * @module @create-a-npm/createNpm
 * @file createNpm.ts
 * @description 创建 npm 主要内容
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-30 13:45
 * @version 1.1.0
 * @lastModified 2026-07-01 00:36
 *
 * 该操作出现在命名完成后
 */
import { askForName } from './ask-for-package-name';
import { createRange } from './create-range/index';
import { createChild } from './createChild/index';
import custom from './custom/index';
import { dataStore } from './data-store/index';
import { packageIndex } from './simple/index';
import { dog } from './utils/dog';

/**
 * 开始根据数据创建包
 */
export async function createNpm(): Promise<void> {
  dog('开始构建应用');
  /**
   *
   *  检测是否遗漏了询问包名
   *
   * 倘若并没有配置 name 属性值，则
   * */
  if (dataStore.name == '') {
    await askForName();
    await custom();
    await createNpm();
    return;
  }

  if (dataStore.workspace) {
    if (dataStore.withRoot) createRange();
    createChild();
    return;
  } else {
    // 包下文件
    packageIndex();
    return;
  }
}
