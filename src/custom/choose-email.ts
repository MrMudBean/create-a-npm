import { question, selection, SelectionParamObjectData } from 'a-command';
import { runOtherCode } from 'a-node-tools';
import { isBusinessEmptyString, isType, isUndefined } from 'a-type-of-js';
import { brightBlackPen } from 'color-pen';
import { dataStore } from '../data-store/index';
import { dun, dog } from '../utils/dog';
import { exitProgram } from '../utils/index';
import { qqi } from '../utils/qqi';
import { readLocalValue } from './readLocalValue';
import { appendDiy } from './util-append-diy';

/**  配置使用邮箱   */
export async function chooseEmail() {
  const data: SelectionParamObjectData<string | symbol>[] = [];
  // 获取本地 git  中配置的邮箱
  await getGitConfigUserEmail(data);
  createByName(data);
  readLocalValue(data, 'email');
  const value = appendDiy(data);

  await choose(data, value);
}

/**
 *  获取 git 配置的用户邮箱
 * @param data
 */
async function getGitConfigUserEmail(
  data: SelectionParamObjectData<string | symbol>[],
) {
  const result = await runOtherCode('git config user.email');

  if (!result.success) {
    return await exitProgram(
      '获取本地的 git config user.email 出错\n'.concat(
        result.error || result.data,
      ),
    );
  }

  /**   邮箱  */
  const userEmail = result.data.replace(/\n$/, '') || '';

  if (!isBusinessEmptyString(userEmail)) {
    data.push({
      value: userEmail,
      tip: '该值从 git 全局配置读取',
      label: userEmail,
    });
  }
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
  const email = `${author.name.replace(/\s+/g, '_')}@outlook.com`;

  data.push({
    value: email,
    label: email,
    tip: '该值由 name 值合成而来',
  });
}

/**
 *  选择要使用的用户名
 * @param data
 * @param value
 */
async function choose(
  data: SelectionParamObjectData<string | symbol>[],
  value: symbol,
) {
  const { author } = dataStore.local;
  /**  保留最后的 email 值  */
  const lastEmail = author.email;
  /**  让用户选择用户名  */
  let email = await selection<string | symbol>({
    data,
    info: '请选择您的通讯邮箱',
  });

  if (isUndefined(email)) return await exitProgram();

  // 选择了手动触发收订选择
  if (isType<symbol>(email, i => i === value)) email = await readInputEmail();

  if (dun) dog(brightBlackPen('获取当前的用户名 '), email);

  dog('是否执行写入', qqi.available);
  dataStore.package.author.email = author.email = email as string;
  /**  保证可写  */
  if (qqi.available && lastEmail !== email) {
    dog('写入的值', dataStore.local);
    qqi.write('config', dataStore.local);
  }
}

/**  读取用户输入的用户名  */
async function readInputEmail() {
  const result = await question({
    text: '请输入您将配置的邮箱',
    maxLen: 50,
    minLen: 5,
    verify: [
      {
        reg: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        info: '需符合邮箱基本模式',
      },
    ],
  });

  if (isUndefined(result)) {
    return await exitProgram();
  }
  return result;
}
