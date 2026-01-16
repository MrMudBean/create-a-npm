import { selection, SelectionParamData } from 'a-command';
import { isUndefined } from 'a-type-of-js';
import { greenPen } from 'color-pen';
import { dataStore } from '../data-store/index';
import { originDependencies } from '../data-store/origin-dependencies';
import { Dependencies } from '../types';
import { dog } from '../utils/dog';
import { qqi } from '../utils/qqi';

/**  问询当前使用的依赖项  */
export async function askForDependencies() {
  const { local } = dataStore;

  /**  本地的配置（该值已在 askForLastConfig 中进行了初始化）  */
  const config = local.dependencies;

  const data: SelectionParamData<Dependencies> = [
    {
      value: 'rollup',
      tip: '该项为必须项',
      label: '打包工具 rollup',
      checked: true,
      disable: true,
    },
    {
      value: 'typescript',
      tip: '如果使用 typescript 建议使用该项',
      label: '使用 ' + greenPen`typescript`,
      checked: config.includes('typescript'),
    },
    ...(
      [
        ['eslint', `使用代码问题工具 ${greenPen`eslint`}`],
        ['prettier', `格式化代码 ${greenPen`prettier`}`],
        ['husky', `git 提交 hook 管理 ${greenPen`husky`}`],
        ['action', `CI/CD 使用自动化构建、发布 ${greenPen`github action`} `],
      ] as [Dependencies, string][]
    ).map(e => ({
      value: e[0] as Dependencies,
      label: e[1],
      checked: config.includes(e[0]),
    })),
  ];

  const result = await selection<Dependencies>({
    data,
    kind: 'check',
    info: '请选择要使用的辅助功能',
  });

  dog('用户选择的依赖', result);

  if (isUndefined(result)) {
    local.dependencies = originDependencies;
    return;
  }
  local.dependencies = result;

  if (qqi.available) {
    dog('执行储存的数据', local);
    qqi.write('config', local);
  }
}
