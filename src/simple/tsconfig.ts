import { writeToJsonFile } from '../utils';

/** 将创建三个 tsconfig 文件的方法合并 */
export function tsconfigJson(): void {
  tsconfigBaseJson();
  _tsconfigJson();
  tsconfigTypesJson();
}

/** 导出生成 tsconfig.base.json 文件  */
export function tsconfigBaseJson(): void {
  writeToJsonFile('tsconfig.base.json', {
    compilerOptions: {
      forceConsistentCasingInFileNames: true,
      // baseUrl: '.',
      rootDir: '.',
      jsx: 'preserve',
      strict: true,
      target: 'ESNext',
      module: 'ESNext',
      skipLibCheck: true,
      esModuleInterop: true,
      moduleResolution: 'Bundler',
      allowSyntheticDefaultImports: true,
      isolatedModules: true,
      lib: ['ESNext', 'DOM'],
      sourceMap: false,
    },
  });
}

/** 导出生成 tsconfig.json 配置文件 */
function _tsconfigJson(): void {
  writeToJsonFile('tsconfig.json', {
    extends: './tsconfig.base.json',
    include: ['index.ts', 'src/**/*.ts', '**.d.ts', 'test/**/*.ts'],
    exclude: ['node_modules', 'dist'],
  });
}

/** 导出生成的生产环境的 .d.ts 文件的 tsconfig 配置 */
export function tsconfigTypesJson(): void {
  writeToJsonFile('tsconfig.types.json', {
    extends: './tsconfig.base.json',
    compilerOptions: {
      emitDeclarationOnly: true,
      declaration: true,
      declarationDir: 'dist/es',
    },
    exclude: ['node_modules', 'test', 'dist', 'eg'],
  });
}
