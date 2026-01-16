import { selection } from 'a-command';
import { detectPackageManager } from 'a-node-tools';
import { commandParameters } from './data-store/commandParameters';
import { acceptManagerValue } from './types';

/**  问询使用的 node.js 的包管理器  */
export async function askForPackageManger() {
  const { manager } = commandParameters;
  /**  启动使用的命令  */
  const startUsing = detectPackageManager();
  /**  展示数据  */
  const data: acceptManagerValue[] = (() => {
    const _arr = [...manager.accept];
    if (_arr[0] === startUsing) return _arr;
    for (let i = 0, j = _arr.length; i < j; i++) {
      if (_arr[i] === startUsing) {
        [_arr[0], _arr[i]] = [_arr[i], _arr[0]];
        break;
      }
    }
    return _arr;
  })();
  const value = await selection<acceptManagerValue>({
    info: '请选择您使用的包管理器',
    data,
  });
  manager.value = value ?? 'npm';
}
