import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFileSync,
  getDirectoryBy,
} from '@vvi/node';

// package.json 文件内容
const packageJson = readFileToJsonSync('./dist/package.json');
const newName = 'create-a-pkg';
packageJson.name = newName;
packageJson.bin = Object.fromEntries([[newName, './bin.js']]);
packageJson.deprecate =
  '未来版本可能不再随 create-a-npm 发布，建议优先使用 create-a-npm';
{
  //  写入 package.json
  const distPath = getDirectoryBy('dist', 'directory');
  const distPackagePath = pathJoin(distPath, './dist/package.json');
  writeJsonFileSync(distPackagePath, packageJson);
}
