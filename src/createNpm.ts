/**
 * @packageDocumentation
 * @module @create-a-npm/createNpm
 * @file createNpm.ts
 * @description 创建 npm 主要内容
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-30 13:45
 * @version 1.1.0
 * @lastModified 2026-01-16 13:46
 *
 * 该操作出现在命名完成后
 */
import { askForName } from './ask-for-name';
import { createRange } from './create-range';
import { createChild } from './createChild';
import custom from './custom';
import { dataStore } from './data-store';
import { packageIndex } from './simple';
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

  if (dataStore.childPkg) {
    if (dataStore.carryRange) createRange();
    createChild();
    return;
  }

  // 包下文件
  packageIndex();
}
