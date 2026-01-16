import { mkdirSync } from 'node:fs';
import { question } from 'a-command';
import { getNpmPkgInfo, isEmptyDir } from 'a-node-tools';
import { isUndefined } from 'a-type-of-js';
import { brightRedPen, hexPen, magentaPen } from 'color-pen';
import { dataStore } from '../data-store';
import { exitProgram } from '../utils';
import { dog, dun } from '../utils/dog';
import { waiting } from '../utils/waiting';
import { carryRange } from './carryRange';

/**
 *  目录审视及构建目录
 * @param pkgName
 */
export async function createCatalog(pkgName: string): Promise<boolean> {
  dataStore.childPkg = dataStore.carryRange = false;
  if (pkgName.startsWith('@')) {
    dataStore.childPkg = true;
    await carryRange(pkgName);
  }
  // 不包含 @

  /**  文件路径  */
  const filePath = pkgName.startsWith('@')
    ? dataStore.carryRange
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
    const tip = ['更改为其他名称', '忽视并继续', '直接退出'];
    const response = await question({
      text: hexPen(
        '#f63',
      )`当前包名称（${magentaPen(pkgName)}）已经存在于 npm 中`,
      tip,
    });
    if (isUndefined(response) || response === tip[2]) {
      return await exitProgram();
    }
    // 仅处理再输入
    if (response === tip[0]) return false;
  }

  dataStore.name = pkgName; /// 将包名赋值给 data
  /// 当前状态下表明该工作目录下存在同名文件夹且为空
  if (dirIsEmpty === -1) {
    ///  当前状态下表明该工作目录下并没有同名文件夹，这时候创建一个空的文件夹
    mkdirSync(filePath, { recursive: true });
  }
  return true;
}
