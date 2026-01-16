import { question } from 'a-command';
import { isUndefined } from 'a-type-of-js';
import { hexPen } from 'color-pen';
import { exitProgram } from '../utils';

/**
 * 名字不符合规范
 */
export async function nameIsNotEligible() {
  const tip = ['重新输入', '退出'];
  const result = await question({
    text: hexPen('#f63')('您的输入为字符非法') + '重新输入或退出',
    tip,
  });

  if (isUndefined(result) || result === tip[1]) return await exitProgram();
}
