import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  构建读我  */
export function createReadMe() {
  const { author } = dataStore.local;
  const { name, url } = author;

  const _name = dataStore.name.replace(/^@/, '');

  const nameList = _name.split('/');

  writeFileSync(
    dataStore.pkgFile('README.md'),
    `# ${dataStore.name}
\r
[![version](<https://img.shields.io/npm/v/${dataStore.name}.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/${dataStore.name}) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/${name.replace(/\s+/g, '_')}/${nameList[0]}/issues)
  
## 文档地址

参看 [${url}/${_name}](${url}/${_name})`,
  );
}
