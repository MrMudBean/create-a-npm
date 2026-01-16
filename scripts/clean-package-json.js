import {
  pathJoin,
  readFileToJsonSync,
  getDirectoryBy,
  writeJsonFile,
} from 'a-node-tools';

let packageJson = readFileToJsonSync('./package.json');

[
  'scripts',
  // 本应用比较依赖于 devDependencies
  // 'devDependencies',
  'lint-staged',
  'private',
].forEach(key => delete packageJson[key]);

packageJson = {
  ...packageJson,
  author: {
    name: '🥜',
    email: 'earthnut.dev@outlook.com',
    url: 'https://earthnut.dev',
  },
  description: '一个简单的代码模板库',
  license: 'MIT',
  files: ['bin.mjs'],
  keywords: ['crate-a-npm', 'create-a-pkg', 'earthnut'],
  repository: {
    type: 'git',
    url: 'git+https://github.com/earthnutDev/create-a-npm.git',
  },
  homepage: 'https://earthnut.dev/npm/create-a-npm',
  bugs: {
    url: 'https://github.com/earthnutDev/create-a-npm/issues',
    email: 'earthnut.dev@outlook.com',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  bin: {
    'create-a-npm': 'bin.mjs',
  },
};

// 写入 dist/package.json
{
  const distPath = getDirectoryBy('dist', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFile(distPackagePath, packageJson);
}
