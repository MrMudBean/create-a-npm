/**
 * @module @create-a-npm/create-read-me
 * @file create-read-me.ts
 * @description _
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-30 07:54
 * @version 1.2.0
 * @lastModified 2026-01-30 07:55
 */

import { dataStore } from './index';

/**
 * # 读我
 */
export function createReadMeText() {
  const { author } = dataStore.local;
  const { name, url } = author;

  const _name = dataStore.name.replace(/^@/, '');

  const nameList = _name.split('/');
  return `# ${dataStore.name}
\r
[![version](<https://img.shields.io/npm/v/${dataStore.name}.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/${dataStore.name}) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/${name.replace(/\s+/g, '_')}/${nameList[0]}/issues)
  
## 文档地址

参看 [${url}/${_name}](${url}/${_name})`;
}
