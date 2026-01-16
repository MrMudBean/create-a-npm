import { mkdirSync, writeFileSync } from 'node:fs';
import { pathJoin } from 'a-node-tools';
import { dataStore } from '../data-store/index';

/**  构建脚本域  */
export function createScripts() {
  mkdirSync(pathJoin(dataStore.pkgFile('scripts')), { recursive: true });
  const { author } = dataStore.local;
  const nameList = dataStore.name.replace(/^@/, '').split('/');
  const name = nameList[0]; // 包名
  const { bin } = dataStore;
  writeFileSync(
    dataStore.pkgFile('scripts/clean-package-json.js'),
    `import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFileSync,
  ${
    bin !== 1
      ? `getDirectoryBy,
    fileExist,`
      : ''
  }
} from 'a-node-tools';
${
  bin !== 1
    ? `import { readdirSync } from 'node:fs';
import { basename, extname } from 'node:path';`
    : ''
}

// 原始 package.json 内容
let packageJson = readFileToJsonSync('./package.json');
const dependencies = packageJson.dependencies;
// 移除冗余的键
[
  'scripts',
  'devDependencies',
  'lint-staged',
  'private',
  'dependencies',
].forEach(key => delete packageJson[key]);
  ${
    bin !== 1
      ? `const esPrefix = 'es'; // es 前缀
const cjsPrefix = 'cjs'; // cjs 前缀
const dtsPrefix = 'es/src'; // 类型文件的前缀
// 查看当前打包 dist 文件路径
const distParentPath = getDirectoryBy('dist', 'directory');
// <--  !!! -->
// <--  !!! -->
// <--  !!! -->
// 查看当前的源码文件路径（原则上与上面值一致）
const srcParentDirectory = getDirectoryBy('src', 'directory');
// 当前 src 的路径
const srcDirectory = pathJoin(srcParentDirectory, 'src');
// src 目录下的文件列表
const srcChildrenList = readdirSync(srcDirectory);
// 打包的 exports
const exportsList = {};

for (const childrenName of srcChildrenList) {
  // 如果是测试文件则跳过
  if (
    // 剔除测试文件
    childrenName.endsWith('.test.ts') ||
    // 剔除单独配置的根文件
    childrenName.endsWith('index.ts') ||
    childrenName.endsWith('utils') ||
    // 剔除非导出模块
    ['testData.ts', 'types.ts'].includes(childrenName)
  )
    continue;
  // 文件名（不带后缀）
  const childrenBaseName = basename(childrenName, extname(childrenName));
  // 子文件/夹的路径
  const childPath = pathJoin(srcDirectory, childrenName);

  const childFile = fileExist(childPath); // 文件元数据
  if (!childFile) throw new RangeError(\`\${childrenName} 文件未能读取\`);
  // 子文件是文件夹时以 index.xxx.js 为准
  if (childFile.isDirectory()) {
    exportsList[\`./\${childrenBaseName}\`] = {
      default: \`./\${esPrefix}/\${childrenName}/index.js\`,
      import: \`./\${esPrefix}/\${childrenName}/index.js\`,
      require: \`./\${cjsPrefix}/\${childrenName}/index.js\`,
      types: \`./\${dtsPrefix}/\${childrenName}/index.d.ts\`,
    };
  } else if (childFile.isFile()) {
    exportsList[\`./\${childrenBaseName}\`] = {
      default: \`./\${esPrefix}/\${childrenBaseName}.js\`,
      import: \`./\${esPrefix}/\${childrenBaseName}.js\`,
      require: \`./\${cjsPrefix}/\${childrenBaseName}.js\`,
      types: \`./\${dtsPrefix}/\${childrenBaseName}.d.ts\`,
    };
  } else {
    throw new RangeError(\`\${childrenName} 文件类型不符合要求\`);
  }
}`
      : ''
  }
packageJson = {
  ...packageJson,
  ${
    // 当非完全执行库
    bin !== 1
      ? `main: \`\${cjsPrefix}/index.js\`,
    module: \`\${esPrefix}/index.mjs\`,
    types: 'index.d.ts',`
      : ''
  }
  author: {
    name: '${author.name}',
    email: '${author.email}',
    url: '${author.url}',
  },
  description: '',
  license: 'MIT',
  files: [${bin !== 1 ? 'cjsPrefix, esPrefix ,' : ''} ${bin !== 0 ? 'bin.js ,' : ''} 'LICENSE', 'README.md'],
  
  exports: {
    '.': {
      import: {
        default: './index.mjs',
        types: './index.d.ts',
      },
      require: {
        default: './index.cjs',
        types: './index.d.ts',
      },
    },
  },

  keywords: ['${name}', '${nameList[0]}'],
  homepage: '${author.url}',
  dependencies,
  bugs: {
    url: 'https://github.com/${author.name}/${name}/issues',
    email: '${author.email}',
    },${
      bin !== 0
        ? `
      bin: {
        ${dataStore.name} : './bin.js',
        },
        `
        : ''
    } 
  repository: {
    type: 'git',
    url: 'git+https://github.com/${author.name}/${name}.git',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  browserslist: ['node>=18.0.0'],
  engines: {
    node: '>=18.0.0',
  },
};

{
  // 整理打包后 package.json 文件路径
  const distPackagePath = pathJoin(distParentPath, './dist/package.json');
  // 写入新的 packages.json 文件
  writeJsonFileSync(distPackagePath, packageJson);
}
`,
  );
}
