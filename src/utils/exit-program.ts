/**
 * @module @create-a-npm/exit-program
 * @file exit-program.ts
 * @description 退出程序
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-01-31 19:15
 * @version 1.2.1
 * @lastModified 2026-01-31 19:16
 */

import { cursorAfterClear, cursorShow, typewrite } from 'a-node-tools';
import { command } from './command';
import { waiting } from './waiting';

/**
 * ## 退出程序
 * @param message
 */
export async function exitProgram(
  message: string = '好的，正在做退出前最后的工作，请稍等',
): Promise<never> {
  await typewrite(message);
  waiting.destroyed();
  cursorAfterClear();
  cursorShow();
  return command.end();
}
