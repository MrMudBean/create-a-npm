import { question } from 'a-command';
import { isUndefined } from 'a-type-of-js';
import { magentaPen } from 'color-pen';
import { exitProgram } from '../utils';

/**  读取包名  */
export async function readName(): Promise<string> {
  const result = await question({
    text: '您即将创建的包名',
    tip: '请使用空格/连字符(-)做分隔符',
    minLen: 1,
    maxLen: 212,
    verify: [
      {
        reg: /^[a-z@]/,
        info: '首字符应为小写英文字符或 @',
      },
      {
        reg: /[A-Z]/,
        info: '不应当有大些英文字符',
        inverse: true,
      },
      {
        reg: /^[^@].*\/.*/,
        info: `仅当为范围时才可以包含 ${magentaPen`/`} 符号`,
        inverse: true,
      },
      {
        reg: /.*\/.*\/.*/,
        info: `仅只能包含一个 ${magentaPen`/`} 符号`,
        inverse: true,
      },
      {
        reg: /^[@a-z].*@.*$/,
        info: `${magentaPen`@`} 仅允许在首位出现`,
        inverse: true,
      },
      {
        reg: /^[a-z0-9@/\-_.]+$/,
        info: `仅允许 ${magentaPen`-`}、${magentaPen`_`} 字符出现`,
      },
    ],
  });

  if (isUndefined(result)) {
    return await exitProgram('您选择退出，清稍等');
  }

  return result;
}
