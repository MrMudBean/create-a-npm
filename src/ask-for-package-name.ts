import { mkdirSync } from 'node:fs';
import { question, selection } from 'a-command';
import { sleep } from 'a-js-tools';
import {
  detectPackageManager,
  getNpmPkgInfo,
  isEmptyDir,
  isWorkSpace,
} from 'a-node-tools';
import { isBusinessEmptyString, isFalse, isUndefined } from 'a-type-of-js';
import { brightRedPen, greenPen, hexPen, magentaPen } from 'color-pen';
import { dataStore } from './data-store/index';
import { command } from './utils/command';
import { dog, dun } from './utils/dog';
import { exitProgram } from './utils/exit-program';
import { waiting } from './utils/waiting';

/**
 *
 * @description 查看是否当前有项目名
 * @param [firstCall=true]  是否是第一次调用，因为在名称不符合时将递归调用
 * @returns  Promise<void>>   没有返回值
 *
 */
export async function askForName(firstCall: boolean = true): Promise<void> {
  // ++++++++++++++++++++++ 》〉》〉》〉》 步骤一：获取用户输入包名 ++++++++++++++++++++++
  /**  将创建的包的名称 */
  let pkgName: string = (firstCall && command.args.$original[0]) || '';
  dog('当前获取的输入名称', pkgName);
  // 检测出当前目录下包含同名包且不为空
  if (isBusinessEmptyString(pkgName)) pkgName = await waitInputName();

  pkgName = pkgName.trim().replace(/\s+/gm, '-'); // 清理空格即转换连字符

  // 若当前名不符合要求
  if (
    isBusinessEmptyString(pkgName) ||
    // 首字符不正确
    /^[^a-z@]/.test(pkgName) ||
    // 首不为 @ 时包含了 /
    /^[a-z0-9][a-z0-9.\-_]*\/[a-z0-9.\-_]*$/.test(pkgName) ||
    // 长度超长
    pkgName.length > 212 ||
    // 包含大写英文
    /[A-Z]/gm.test(pkgName) ||
    // 包含空格
    /\s/.test(pkgName) ||
    // 包含两个 /
    /.*\/.*\/.*/.test(pkgName) ||
    // 非首字符出现了 @
    /^[@a-z].*@.*$/gm.test(pkgName) ||
    // 非法字符
    /^[^a-z0-9@/\-_.]+$/gm.test(pkgName)
  ) {
    await nameIsNotEligible(); // 问询会直接终止程序的运行
    await sleep(100);
    return await askForName(false); // 用户选择重试
  }
  // ++++++++++++++++++++++ 步骤一：获取用户输入包名 《〈《〈《〈《 ++++++++++++++++++++++

  // ++++++++++++++++++++++ 》〉》〉》〉》 步骤二：查看是否可构建该名称文件 ++++++++++++++++++++++
  const result = await createCatalog(pkgName);
  // ++++++++++++++++++++++ 步骤二：查看是否可构建该名称文件 《〈《〈《〈《 ++++++++++++++++++++++

  // ++++++++++++++++++++++ 》〉》〉》〉》 步骤三：如果当前不允许构建，则再次获取用户输入包名 ++++++++++++++++++++++
  if (isFalse(result)) return await askForName(false);
  // ++++++++++++++++++++++ 步骤三：如果当前不允许构建，则再次获取用户输入包名 《〈《〈《〈《 ++++++++++++++++++++++
}

/**  读取包名  */
async function waitInputName(): Promise<string> {
  const result = await question({
    text: '您即将创建的包名',
    tip: '请使用空格/连字符(-)做分隔符',
    minLen: 1,
    maxLen: 212,
    verify: [
      {
        reg: /^[a-z0-9@]/,
        info: '首字符应为小写英文字符、数字或 @',
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
        reg: /\/$/,
        info: `不能以 ${magentaPen`/`} 符号结尾`,
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
        reg: /^@[^/]+$/,
        info: '域后必须携带子包名',
        inverse: true,
      },
      {
        reg: /^[a-z0-9@/\-_.]+$/,
        info: `仅允许 ${magentaPen`-`}、${magentaPen`_`} 特殊字符`,
      },
    ],
  });

  return !result ? await exitProgram('您选择退出，清稍等') : result;
}

/**
 * 名字不符合规范
 */
async function nameIsNotEligible() {
  const tip = ['重新输入', '退出'];
  const result = await question({
    text: hexPen('#f63')('您的输入为字符非法') + '重新输入或退出',
    tip,
  });

  // 如果 tip 值长度或顺序发生变化，这里逻辑是需要更改的
  if (result !== tip[0]) return await exitProgram();
}

/**
 * ## 目录审视及构建目录
 *
 *
 * @param pkgName 包名
 */
async function createCatalog(pkgName: string): Promise<boolean> {
  dataStore.workspace = dataStore.withRoot = false; // 重置数据（嗯，好像没必要。因为数据不会是脏的）
  const workSpace = isWorkSpace(detectPackageManager()); // 当前是工作区

  // 工作区
  if (workSpace) {
    setIsWorkSpace(true); // 设置为工作区
    setWithRoot(false); // 给  false 的值设置为 false
  } else {
    if (pkgName.startsWith('@')) {
      await carryRange(pkgName); /// 携带域时问询
    }
  }

  /**  文件路径  */
  const filePath = pkgName.startsWith('@')
    ? dataStore.withRoot
      ? pkgName.replace(/@/, '').replace(/\//, '/packages/')
      : pkgName.replace(/^.*\/(.*)$/, '$1')
    : pkgName;

  dog('获取当前的目录', filePath);
  /**
   * 查看是否当前有项目名是否为空
   */
  const dirIsEmpty = isEmptyDir(filePath);
  // 检测出当前目录下包含同名包且不为空
  if (dirIsEmpty == 0) {
    const tip = ['更换为其他名称', '直接退出'];
    const result = await question({
      text: `当前目录下存在非空同名文件夹（${brightRedPen(pkgName)})`,
      tip,
    });

    // 用户退出
    if (isUndefined(result) || result === tip[1]) return await exitProgram();
    // 返回 false 触发再次输入
    return false;
  }

  waiting.run({
    info: '正在检测 npm 是否有该同名包',
  });
  /**  线上同名包数据  */
  const pkgInfo = (dun && (await getNpmPkgInfo(pkgName))) || {
    data: undefined,
  };
  waiting.destroyed();

  dog('获取线上的 npm 包数据', pkgInfo);
  if (pkgInfo.data) {
    const data = ['更改为其他名称', '忽视并继续', '直接退出'];
    const response = await selection({
      info: hexPen(
        '#f63',
      )`当前包名称（${magentaPen(pkgName)}）已经存在于 npm 中`,
      data,
    });
    dog('用户选择：', response);
    if (isUndefined(response) || response === data[2]) {
      return await exitProgram();
    }
    // 仅处理再输入（返回让用户重新输入）
    if (response === data[0]) return false;
  }

  dataStore.name = pkgName; /// 将包名赋值给 data
  /// 当前状态下表明该工作目录下存在同名文件夹且为空
  if (dirIsEmpty === -1) {
    ///  当前状态下表明该工作目录下并没有同名文件夹，这时候创建一个空的文件夹
    mkdirSync(filePath, { recursive: true });
  }
  return true;
}

/**
 *  携带域时候的判断
 * @param pkgName
 */
async function carryRange(pkgName: string) {
  const result = await selection<number>({
    info: '检测到您设定的包名中包含域',
    data: [
      {
        value: 0,
        label: '独立包模式',
        tip: `将 ${greenPen('直接在当前目录')} 构建包`,
      },
      {
        value: 1,
        label: '我就是在工作区下',
        tip: `抱歉，可能我判断失误，为您构建为子包`,
      },
      {
        value: 2,
        label: '嵌套包（工作区）模式',
        tip: `默认为您创建 ${greenPen(pkgName.replace(/@/, '').replace(/\//, '/packages/'))} 路径`,
      },
    ],
  });
  if (isUndefined(result)) return await exitProgram();

  switch (result) {
    case 1:
      setIsWorkSpace(true);
      setWithRoot(false);
      break;
    case 2:
      setIsWorkSpace(true);
      setWithRoot(true);
      break;
    default:
      // 其实两个值本身就是 false
      setIsWorkSpace(false);
      setWithRoot(false);
      break;
  }
}

/**
 * ## 设置当前携带工作区的根
 *
 * @param value
 */
function setWithRoot(value: boolean) {
  dataStore.withRoot = Boolean(value);
}

/**
 * ## 设置为工作区
 * @param value
 */
function setIsWorkSpace(value: boolean) {
  dataStore.workspace = Boolean(value);
}
