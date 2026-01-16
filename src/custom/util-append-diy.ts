import { SelectionParamObjectData } from 'a-command';

/**
 *  向  data 追加数据
 * @param data
 */
export function appendDiy(data: SelectionParamObjectData<string | symbol>[]) {
  /**  获取一个随机的字符串  */
  const value = Symbol('diy');
  data.push({
    label: `手动输入值`,
    value,
    tip: '使用其他输入名称',
  });
  return value;
}
