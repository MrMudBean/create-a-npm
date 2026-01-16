/**
 * @packageDocumentation
 * @module @create-a-npm/utils
 * @file utils.ts
 * @description 工具函数文件
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-28 12:55
 * @version 1.1.0
 * @lastModified 2026-01-16 12:57
 */
import {
  _p,
  colorLine,
  cursorAfterClear,
  cursorShow,
  typewrite,
  writeJsonFileSync,
} from 'a-node-tools';
import { randomPen } from 'color-pen';
import { dataStore } from '../data-store';
import { commandParameters } from '../data-store/commandParameters';
import { command } from './command';
import { waiting } from './waiting';

/**
 * ## 打印一些内容
 * @param message  {@link  String} 将要打印的信息
 * @returns void
 *
 */
export function printSome(message: string): undefined {
  _p(randomPen(new Date().toLocaleTimeString().concat(message)));
}

/**
 *
 *  写入 json 文件
 *
 * @param fileName  {@link string} 写入的文件名
 * @param jsonData  写入的数据
 * @returns void
 *
 */
export function writeToJsonFile(fileName: string, jsonData: unknown): void {
  writeJsonFileSync(dataStore.pkgFile(fileName), jsonData as never);
}

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
  colorLine('终结线', true);
  return command.end();
}

/**  构建安装  */
export function createCI() {
  const { manager } = commandParameters;
  return manager.value === 'pnpm'
    ? 'pnpm install --frozen-lockfile --prod=false'
    : manager.value + ' ci';
}
