import { writeFileSync } from 'node:fs';
import { dataStore } from '../data-store/index';

/**  构建多层包与 ts 相关的  */
export function createTs() {
  writeFileSync(
    dataStore.rangeFile('tsconfig.json'),
    JSON.stringify({
      extends: './tsconfig.base.json',
      include: [
        'packages/**/index.ts',
        'packages/**/src/**/*.ts',
        'packages/**/eg/**/*.ts',
      ],
      exclude: [
        'node_modules',
        'packages/**/node_modules',
        'packages/**/**/*.test.ts',
        'jest.setup.ts',
      ],
    }),
  );

  writeFileSync(
    dataStore.rangeFile('tsconfig.base.json'),
    JSON.stringify({
      compilerOptions: {
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
    }),
  );
}
