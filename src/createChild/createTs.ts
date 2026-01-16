import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  构建 ts  */
export function createTs() {
  if (dataStore.bin !== 1)
    writeFileSync(
      dataStore.pkgFile('tsconfig.types.json'),
      `/**  该文件打包前使用  */
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "emitDeclarationOnly": true,
    "declaration": true,
    "declarationDir": "dist/"
    // "types": ["node"],
  },
  "exclude": ["node_modules", "dist", "**/*.test.ts", "eg", "jest.setup.ts"]
}
`,
    );

  writeFileSync(
    dataStore.pkgFile('tsconfig.rollup.json'),
    `{
  "extends": "./tsconfig.types.json",
  "compilerOptions": {
    "declarationDir": null,
    "declaration": false
  },
  "include": ["eg", "eg/*.ts", "src/**/*.ts", "./index.ts"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
`,
  );
}
