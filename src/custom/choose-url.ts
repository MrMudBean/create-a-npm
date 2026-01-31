import { question, selection, SelectionParamObjectData } from 'a-command';
import { isBusinessEmptyString, isType, isUndefined } from 'a-type-of-js';
import { brightBlackPen } from 'color-pen';
import { dataStore } from '../data-store/index';
import { dog, dun } from '../utils/dog';
import { exitProgram } from '../utils/index';
import { qqi } from '../utils/qqi';
import { readLocalValue } from './readLocalValue';
import { appendDiy } from './util-append-diy';

/**  选择使用 url  */
export async function chooseUrl() {
  const data: SelectionParamObjectData<string | symbol>[] = [];

  createByName(data);
  readLocalValue(data, 'url');
  const value = appendDiy(data);

  await choose(data, value);
}

/**
 *  由用户名构建
 * @param data
 */
function createByName(data: SelectionParamObjectData<string | symbol>[]) {
  const { author } = dataStore.local;

  if (isBusinessEmptyString(author.name)) {
    return;
  }
  const email = `${author.name.replace(/\s+/g, '_')}.github.io`;

  data.push({
    value: email,
    label: email,
    tip: '该值由 name 值合成而来',
  });
}

/**
 *  选择要使用的用网址
 * @param data
 * @param value
 */
async function choose(
  data: SelectionParamObjectData<string | symbol>[],
  value: symbol,
) {
  const { author } = dataStore.local;
  /**  保留最后的 url 值  */
  const lastUrl = author.url;

  /**  让用户选择用户名  */
  let url = await selection<string | symbol>({
    data,
    info: '请配置您的个人网站',
  });

  if (isUndefined(url)) return await exitProgram();

  // 选择了手动触发收订选择
  if (isType<symbol>(url, i => i === value)) url = await readInputUrl();

  if (dun) dog(brightBlackPen('获取当前的网址 '), url);

  dog('是否执行写入', qqi.available);
  dataStore.package.author.url = author.url = url as string;
  /**  保证可写  */
  if (qqi.available && lastUrl !== url) {
    dog('写入的值', dataStore.local);
    qqi.write('config', dataStore.local);
  }
}

/**  读取用户输入的用户名  */
async function readInputUrl() {
  const result = await question({
    text: '请输入您将配置的网址',
    maxLen: 50,
    minLen: 5,
    verify: [
      {
        reg: /^https?:\/{2}.+/,
        info: '需符合网址基本模式',
      },
    ],
  });

  if (isUndefined(result)) {
    return await exitProgram();
  }
  return result;
}
