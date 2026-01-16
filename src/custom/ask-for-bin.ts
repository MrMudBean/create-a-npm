import { selection } from 'a-command';
import { isUndefined } from 'a-type-of-js';
import { greenPen } from 'color-pen';
import { dataStore } from '../data-store/index';

/**  询问是否包含 bin 可执行  */
export async function askForWithBin() {
  const result = await selection<number>({
    info: '请选择开发模式',
    data: [
      {
        value: 0,
        label: '仅是可用库',
        tip: '当前仅是使用的库，譬如：' + greenPen`a-js-tools`,
      },
      {
        value: 1,
        label: '仅是可执行库',
        tip: '当前仅包含可执行内容，譬如：' + greenPen`jja`,
      },
      {
        value: 2,
        label: '库 + bin',
        tip: '即包含可执行又包含可导出使用内容，譬如：' + greenPen`qqi`,
      },
    ],
  });

  if (isUndefined(result)) {
    return;
  }

  dataStore.bin = result;
}
