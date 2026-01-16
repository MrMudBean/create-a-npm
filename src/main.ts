import { unlinkSync } from 'node:fs';
import { _p, colorLine, pathJoin, writeJsonFileSync } from 'a-node-tools';
import { isEmptyString } from 'a-type-of-js';
import {
  brightBlackPen,
  brightGreenPen,
  cyanPen,
  greenPen,
  magentaPen,
} from 'color-pen';
import { askForName } from './ask-for-name';
import { askForPackageManger } from './ask-for-package-manager';
import { createNpm } from './createNpm';
import custom from './custom';
import { dataStore } from './data-store';
import { commandParameters } from './data-store/commandParameters';
import { installDependencies } from './installDependencies';
import { parse } from './parse';
import { exitProgram } from './utils';
import { dog } from './utils/dog';

(async () => {
  // 可写校验
  try {
    try {
      const testFile = pathJoin('test_write' + Date.now());
      writeJsonFileSync(testFile, {});
      unlinkSync(testFile);
    } catch (error) {
      dog.error(error);
      console.log(error);
      return await exitProgram('您没有当前目录的写文件的权限，请确认后再试');
    }

    colorLine('华丽开始分割', true);
    parse(); /// 解析参数
    const { manager } = commandParameters;
    dog(manager);
    if (isEmptyString(manager.value)) {
      await askForPackageManger();
    } else {
      _p(cyanPen`您选择使用 ${magentaPen(manager.value)} 作为包管理器`);
    }

    /// 设定包名
    await askForName();

    /// 参看是否自定义包的内容，这里会自定义是否使用 eslint 等相关内容
    await custom();

    /// 开始包创建
    await createNpm();
    if (dataStore.install) await installDependencies();

    _p(greenPen`创建项目完毕`);
    if (dataStore.childPkg) {
      _p(`请 cd 到 ${magentaPen`./${dataStore.range}`} 目录下`);
    } else {
      _p(`请 cd 到 ${magentaPen(dataStore.cwd)} 目录下`);
    }
    _p();
    if (!dataStore.install)
      _p(
        `执行 ${brightBlackPen(manager.value === 'npm' ? `npm install` : manager.value === 'yarn' ? 'yarn' : 'pnpm install')}`,
      );
    _p(brightBlackPen`简单测试使用 ${brightGreenPen`${manager.value} test`}`);
    _p(
      brightBlackPen`简单打包使用 ${brightGreenPen`${manager.value} run build`}`,
    );
    _p(greenPen`创建项目完毕`);
    _p();

    /// 退出
    await exitProgram('');
  } catch (error) {
    dog.error(error);
  }
})();
