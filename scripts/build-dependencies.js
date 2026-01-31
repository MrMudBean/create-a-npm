/**
 * @module @create-a-npm/build-dependencies
 * @file build-dependencies.js
 * @description 构建依赖版本数据
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-02-01 00:32
 * @version 1.2.1
 * @lastModified 2026-02-01 00:46
 */

import { getPackageJsonSync } from 'a-node-tools';
import { isNull } from 'a-type-of-js';
import { writeFileSync } from 'node:fs';

const pack = getPackageJsonSync();

if (isNull(pack)) {
  console.log('没有找到包配置文件');
} else {
  const { content } = pack;

  const dependencies = {
    ...content.dependencies,
    ...content.devDependencies,
  };

  writeFileSync(
    'src/data-store/dependencies-version.ts',
    `export const deLi: Record<string, string>  = ${JSON.stringify(dependencies, null, 2)}`,
  );
}
