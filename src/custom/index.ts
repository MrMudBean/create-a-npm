/**
 * @packageDocumentation
 * @module @create-a-npm/custom
 * @file index.ts
 * @description 自定义数据
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-28 22:26
 * @version 1.1.0
 * @lastModified 2026-01-16 22:26
 */
import { dog } from '../utils/dog';
import { askForDependencies } from './ask-for-dependencies';
import { askForInitDependencies } from './ask-for-init-dependencies';
import { askForLastConfig } from './ask-for-last-config';
import { askForWithBin } from './ask-for-bin';
import { chooseEmail } from './choose-email';
import { chooseUrl } from './choose-url';
import { chooseUserName } from './choose-user-name';

/**  自定义 */
export default async function custom(): Promise<void> {
  // 如果有上次的配置时，用户选择时候上次的配置
  const result = await askForLastConfig();

  dog('获取需要更改的项', result);
  /**  获取用户名  */
  if (result.includes('name')) await chooseUserName();
  if (result.includes('email')) await chooseEmail();
  if (result.includes('url')) await chooseUrl();
  await askForWithBin();
  await askForDependencies();
  await askForInitDependencies();
}
