import { sleep } from 'a-js-tools';
import { isBusinessEmptyString, isFalse } from 'a-type-of-js';
import { command } from '../utils/command';
import { dog } from '../utils/dog';
import { createCatalog } from './createCatalog';
import { nameIsNotEligible } from './nameIsNotEligible';
import { readName } from './read-name';

/**
 *
 * @description 查看是否当前有项目名
 * @param [firstCall=true]  是否是第一次调用，因为在名称不符合时将递归调用
 * @returns  Promise<void>>   没有返回值
 *
 */
export async function askForName(firstCall: boolean = true): Promise<void> {
  /**
   * 将创建的包的名称
   */
  let pkgName: string = (firstCall && command.args.$original[0]) || '';

  dog('当前获取的输入名称', pkgName);
  // 检测出当前目录下包含同名包且不为空
  if (isBusinessEmptyString(pkgName)) pkgName = await readName();

  // 清理空格即转换连字符
  pkgName = pkgName.trim().replace(/\s+/gm, '-');

  /** 若当前名不符合要求   */
  if (
    isBusinessEmptyString(pkgName) ||
    // 首字符不正确
    /^[^a-z@]/.test(pkgName) ||
    // 首不为 @ 时包含了 /
    /^[a-z0-9][a-z0-9.\-_]*\/[a-z0-9.\-_]*$/.test(pkgName) ||
    // 长度超长
    pkgName.length > 212 ||
    // 包含大写英文
    /[A-Z]/gm.test(pkgName) ||
    // 包含空格
    /\s/.test(pkgName) ||
    // 包含两个 /
    /.*\/.*\/.*/.test(pkgName) ||
    // 非首字符出现了 @
    /^[@a-z].*@.*$/gm.test(pkgName) ||
    // 非法字符
    /^[^a-z0-9@/\-_.]+$/gm.test(pkgName)
  ) {
    await nameIsNotEligible(); // 问询会直接终止程序的运行
    await sleep(100);
    return await askForName(false); // 用户选择重试
  }

  //  审查目录
  const result = await createCatalog(pkgName);

  if (isFalse(result)) {
    return await askForName(false);
  }
}
