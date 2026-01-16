import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFileSync,
  getDirectoryBy,
} from 'a-node-tools';

// package.json 文件内容
const packageJson = readFileToJsonSync('./dist/package.json');
const newName = 'create-a-pkg';
packageJson.name = newName;
packageJson.bin = Object.fromEntries([[newName, './bin.js']]);
{
  //  写入 package.json
  const distPath = getDirectoryBy('dist', 'directory');
  const distPackagePath = pathJoin(distPath, './dist/package.json');
  writeJsonFileSync(distPackagePath, packageJson);
}
