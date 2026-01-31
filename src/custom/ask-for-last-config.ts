import { selection } from 'a-command';
import { enArr } from 'a-js-tools';
import {
  isArray,
  isBusinessEmptyString,
  isEmptyArray,
  isUndefined,
} from 'a-type-of-js';
import { dataStore } from '../data-store/index';
import { LocalConfig } from '../types';
import { dog } from '../utils/dog';
import { exitProgram } from '../utils/exit-program';
import { qqi } from '../utils/qqi';

/**  问询是否使用上一次的配置  */
export async function askForLastConfig(): Promise<string[]> {
  const originList = ['name', 'email', 'url'];
  const { local } = dataStore;

  if (!qqi.available) return originList;

  /**  获取本地储存的数据（既然数据类型是存在，使用时也需要使用 `?.` 防止数据不存在）  */
  const config = qqi.read<LocalConfig>('config');

  if (isUndefined(config?.author)) return originList;

  // 覆盖原参数（这里这么操作防止设置 author 时写入覆盖原有数据）
  if (isArray(config?.dependencies)) local.dependencies = config.dependencies;

  const { author } = config;

  const data = (Object.keys(author) as (keyof typeof author)[])
    // 过滤非法值
    .filter(
      e =>
        !isBusinessEmptyString(author[e]) &&
        (local.author[e] = author[e]) &&
        !0,
    )
    .map(e => ({
      value: e,
      label: `${e} : ${author[e]}`,
      checked: true,
    }));

  if (isEmptyArray(data)) return originList;

  const result = await selection({
    info: '以下为上次使用配置，选中的项将跳过配置',
    data,
    kind: 'check',
  });

  if (isUndefined(result)) return await exitProgram();

  dog('选项的值', result);
  return enArr.difference(originList, result);
}
