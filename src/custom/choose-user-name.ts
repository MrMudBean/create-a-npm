import { userInfo } from 'node:os';
import { question, selection, SelectionParamObjectData } from 'a-command';
import { runOtherCode } from 'a-node-tools';
import { isBusinessEmptyString, isType, isUndefined } from 'a-type-of-js';
import { brightBlackPen } from 'color-pen';
import { dataStore } from '../data-store/index';
import { dog, dun } from '../utils/dog';
import { exitProgram } from '../utils/index';
import { qqi } from '../utils/qqi';
import { readLocalValue } from './readLocalValue';
import { appendDiy } from './util-append-diy';

/** 获取本地的 git username  */
export async function chooseUserName() {
  const data: SelectionParamObjectData<string | symbol>[] = [];
  await getGitConfigUserName(data); // 获取本地 git 中配置的用户名
  getMachineUsername(data); // 获取机器配的用户名
  const value = appendDiy(data);
  /**  读取配置  */
  readLocalValue(data, 'name');
  await choose(data, value);
}

/**
 *  获取机器配置的项
 * @param data
 */
function getMachineUsername(data: SelectionParamObjectData<string | symbol>[]) {
  /**  机器名称  */
  const local_user_name =
    process.env.USER ?? process.env.USERNAME ?? userInfo().username;

  data.push({
    label: `${local_user_name}`,
    value: local_user_name,
    tip: '设备用户名',
  });
}

/**
 *  从 git 配置文件读取用户名
 * @param data
 */
async function getGitConfigUserName(
  data: SelectionParamObjectData<string | symbol>[],
) {
  /**  从 git 中读取姓名值  */
  const result = await runOtherCode('git config user.name');

  if (result.success) {
    /**   用户名  */
    const git_user_name = result.data?.replace(/\n$/, '') || '';

    if (!isBusinessEmptyString(git_user_name)) {
      data.push({
        label: `${git_user_name}`,
        value: git_user_name,
        tip: '由 git 全局配置读取',
      });
    }
  }
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
  const lastUsername = author.name;
  /**  让用户选择用户名  */
  let name = await selection<string | symbol>({
    data,
    info: '请选择要使用的用户名',
  });

  if (isUndefined(name)) return await exitProgram();

  // 选择了手动触发收订选择
  if (isType<symbol>(name, i => i === value)) {
    name = await readInputUserName();
  }

  if (dun) dog(brightBlackPen('获取当前的用户名 '), name);

  dog('是否执行写入', qqi.available);
  dataStore.package.author.name = author.name = name as string;
  /**  保证可写  */
  if (qqi.available && lastUsername !== name) {
    dog('写入的值', dataStore.local);
    qqi.write('config', dataStore.local);
  }
}

/**  读取用户输入的用户名  */
async function readInputUserName() {
  const result = await question({
    text: '请输入您将配置的用户名',
    maxLen: 16,
  });

  if (isUndefined(result)) {
    return await exitProgram();
  }
  return result;
}
