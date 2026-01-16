import { mkdirSync, writeFileSync } from 'node:fs';
import { commandParameters } from '../data-store/commandParameters';
import { dataStore } from '../data-store/index';

/**  构建 github action CI/CD  */
export function createAction() {
  const { manager } = commandParameters;
  const workflow = '.github/workflows';
  // 创建外层目录
  mkdirSync(dataStore.pkgFile(workflow), { recursive: true });
  writeFileSync(
    dataStore.pkgFile(workflow, '发布.yml'),
    `name: 发布到 npm
on:
  push:
    branches: '*'
  workflow_dispatch: # 手动触发
    inputs:
      version:
        description: '触发原因（选填）'
        required: false
        default: '手动触发'
        type: string
      ref:
        description: '发布的分支（选填）'
        required: false
        default: ''
        type: string

# 新的 OpenID Connect 验证方式
# 无需手动填写 NODE_AUTH_TOKEN 且定期更换
permissions:
  id-token: write # 唯一必须的权限：启用 OIDC
  contents: read # write 必须，克隆代码库权限
  # packages: write

jobs:
  pub:
    # 在提交的代码包含 \`version\` 字样时才运行该动作
    # 或者手动触发
    name: |
      发布到 npm
    runs-on: ubuntu-latest
    # 复合条件判断（自动触发检查提交信息，手动触发直接放行）
    # startsWith(github.event.head_commit.message, 'version')
    # contains(github.event.inputs.version, '手动触发')
    # endsWith(github.event.head_commit.message, 'version')
    if: |
      (github.event_name == 'push' && startsWith(github.event.head_commit.message, 'version')) ||
      github.event_name == 'workflow_dispatch'
    steps:
      - name: 代码检出
        uses: actions/checkout@v4
        with:
          ref: \${{ github.event.inputs.ref || github.ref_name }}
          fetch-depth: 1

      - name: 初始化 Node 并设定 Node 版本
        uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org

      - name: clean npm auth
        run: |
          npm config delete //registry.npmjs.org/:_authToken
          rm -f ~/.npmrc
        shell: bash

            ${
              manager.value === 'pnpm'
                ? `
      - name: pnpm 安装
        uses: pnpm/action-setup@v2
        with:
          version: 10
          run_install: false

      - name: 缓存 pnpm
        id: pnpm-store
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache pnpm store
        uses: actions/cache@v4
        with:
          path: \${{ steps.pnpm-store.outputs.STORE_PATH }}
          key: \${{ runner.os }}-pnpm-store-\${{ hashFiles('pnpm-lock.yaml') }}
          restore-keys: |
            \${{ runner.os }}-pnpm-store-
        `
                : manager.value === 'yarn'
                  ? `
        - name: yarn 安装
          uses: actions/setup-yarn@v4
          with:
            version: '1.22' 
        - name: 获取 yarn 缓存路径
          id: yarn-cache-path
          run: echo "CACHE_PATH=$(yarn cache dir)" >> $GITHUB_OUTPUT # 获取 Yarn 全局环衬路径
          
        - name: 缓存 Yarn 依赖
          uses: actions/cache@v4
          with: 
            path: \${{ steps.yarn-cache-path.outputs.CACHE_PATH }} # 缓存 Yarn 全局缓存目录
            key: \${{ runner.os }}-yarn-cache-\${{ hashFiles('yarn.lock) }} # 基于 yarn.lock 哈希值生成唯一的 key
            restore-keys: |
               \${{ runner.os }}-yarn-cache # 缓存未命中时，按前缀恢复最近的缓存 
        `
                  : ''
            }
       
      - name: 发布到 npm
        env:
          NPM_CONFIG_USERCONFIG: /dev/null # 强制忽略本地配置
        run: |
          chmod +x ./scripts/pub.sh
          ./scripts/pub.sh
`,
  );
}
