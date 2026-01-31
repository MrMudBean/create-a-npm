import { unlinkSync } from 'node:fs';
import { selection } from 'a-command';
import {
  _p,
  detectPackageManager,
  pathJoin,
  runOtherCode,
  writeJsonFileSync,
} from 'a-node-tools';
import { isEmptyString, isUndefined } from 'a-type-of-js';
import {
  brightBlackPen,
  brightGreenPen,
  cyanPen,
  greenPen,
  magentaPen,
} from 'color-pen';
import { askForName } from './ask-for-package-name';
import { createNpm } from './createNpm';
import custom from './custom';
import { dataStore } from './data-store';
import { commandParameters } from './data-store/command-parameters';

import { acceptManagerValue } from './types';
import { parse } from './utils/command';
import { dog } from './utils/dog';
import { exitProgram } from './utils/exit-program';

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

    parse(); /// 解析参数
    const { manager } = commandParameters;
    dog(manager);

    // ++++++++++++++++++++++ 》〉》〉》〉》 步骤一：问询使用包管理器 ++++++++++++++++++++++
    await askForPackageManger();
    // ++++++++++++++++++++++ 步骤一：问询使用包管理器 《〈《〈《〈《 ++++++++++++++++++++++

    // ++++++++++++++++++++++ 》〉》〉》〉》 步骤二：设定包名 ++++++++++++++++++++++
    await askForName(); // 在问询包名时判定是否是子包
    // ++++++++++++++++++++++ 步骤二：设定包名 《〈《〈《〈《 ++++++++++++++++++++++

    // ++++++++++++++++++++++ 》〉》〉》〉》 步骤三：设定包构建依赖信息 ++++++++++++++++++++++
    /// 参看是否自定义包的内容，这里会自定义是否使用 eslint 等相关内容
    await custom();
    // ++++++++++++++++++++++ 步骤三：设定包构建依赖信息 《〈《〈《〈《 ++++++++++++++++++++++

    // ++++++++++++++++++++++ 》〉》〉》〉》 步骤四：包文件构建 ++++++++++++++++++++++
    await createNpm();
    // ++++++++++++++++++++++ 步骤四：包文件构建 《〈《〈《〈《 ++++++++++++++++++++++

    // ++++++++++++++++++++++ 》〉》〉》〉》 步骤五：依赖安装 ++++++++++++++++++++++
    if (dataStore.install) await installDependencies();
    // ++++++++++++++++++++++ 步骤五：依赖安装 《〈《〈《〈《 ++++++++++++++++++++++

    // ++++++++++++++++++++++ 》〉》〉》〉》 步骤六：信息打印 ++++++++++++++++++++++
    endOfBuild();
    // ++++++++++++++++++++++ 步骤六：信息打印 《〈《〈《〈《 ++++++++++++++++++++++

    // ++++++++++++++++++++++ 》〉》〉》〉》 步骤七：说再见 ++++++++++++++++++++++
    await exitProgram('');
    // ++++++++++++++++++++++ 步骤七：说再见 《〈《〈《〈《 ++++++++++++++++++++++
  } catch (error) {
    dog.error(error);
  }
})();

/**  问询使用的 node.js 的包管理器  */
async function askForPackageManger() {
  const { manager } = commandParameters;
  if (!isEmptyString(manager.value))
    return _p(cyanPen`您选择使用 ${magentaPen(manager.value)} 作为包管理器`);
  /**  启动使用的命令  */
  const startUsing = detectPackageManager();
  /**  展示数据 (已将启动的包管理器放置到首位) */
  const data: acceptManagerValue[] = Array.from(
    new Set([startUsing, ...manager.accept]),
  );

  const value = await selection<acceptManagerValue>({
    info: '请选择您使用的包管理器',
    data,
  });
  if (isUndefined(value)) return await exitProgram(); // 退出

  manager.value = value ?? 'npm';
}
/**  安装依赖  */
async function installDependencies() {
  const { manager } = commandParameters;
  await runOtherCode({
    code: `${manager.value} install`,
    cwd: dataStore.workspace ? dataStore.rangeFile('') : dataStore.pkgFile(''),
    printLog: true,
    waiting: '请稍等，正在安装依赖',
  });
}

/**
 * ## 构建结束前信息打印
 */
function endOfBuild() {
  const { manager } = commandParameters;
  _p(greenPen`创建项目完毕`);
  _p(
    `请 cd 到 ${magentaPen`./${dataStore.workspace ? dataStore.workSpaceRootPath : dataStore.packagePath}`} 目录下`,
  );
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
}
