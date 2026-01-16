/**
 * @packageDocumentation
 * @module @create-a-npm/command
 * @file command.ts
 * @description 一个由 `a-command` 创建的 command 对象
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-08-30 13:04
 * @version 1.1.0
 * @lastModified 2026-01-16 13:04
 */
import { Args } from 'a-command';

const command = new Args<{
  /**  包管理器  */
  manager: undefined;
}>('create a npm');

command.bind(['manager <-m> (包管理器)']);

// 执行，并在触发 -h、-v 时直接结束应用
command.run().isEnd(true);

export { command };
