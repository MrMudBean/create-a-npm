/**
 * @module @create-a-npm/command
 * @file command.ts
 * @description 一个由 `a-command` 创建的 command 对象
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-30 13:04
 * @version 1.1.0
 * @lastModified 2026-01-30 18:12
 */
import { Args } from 'a-command';
import { commandParameters } from '../data-store/command-parameters';
import { acceptManagerValue } from '../types';
import { dog } from './dog';

const command = new Args<{
  /**  包管理器  */
  manager: undefined;
}>('create a npm');

command.bind(['manager <-m> (包管理器)']);

// 执行，并在触发 -h、-v 时直接结束应用
command.run().isEnd(true);

/**  解析参数使用  */
export function parse() {
  /**  使用参数  */
  const arg = command.args.$map;

  const { manager } = commandParameters;

  dog('解析元素参数', arg);
  /**  管理对象的值  */
  const _manager: acceptManagerValue = (arg.manager?.value?.[0] ??
    '') as acceptManagerValue;

  /** 如果设定值为可接受的值  */
  if (manager.accept.includes(_manager as never)) {
    manager.value = _manager;
  }
}

export { command };
