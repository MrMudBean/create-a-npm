import { commandParameters } from './data-store/commandParameters';
import { acceptManagerValue } from './types';
import { command } from './utils/command';
import { dog } from './utils/dog';

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
