import { mkdirSync, writeFileSync } from 'node:fs';
import { commandParameters } from '../data-store/commandParameters';
import { dataStore } from '../data-store/index';
import { createCI } from '../utils';

/**  创建 github action  */
export function createAction() {
  const { manager } = commandParameters;
  const dir = '.github/workflows';
  // 创建外层目录
  mkdirSync(dataStore.rangeFile(dir), { recursive: true });
  writeFileSync(
    dataStore.rangeFile(dir, '发布.yml'),
    `name: 发布到 npm
on:
  push:
    branches: '*'
    paths:
      - 'packages/**' # 主包更新
      - 'package.json' # 全局依赖

  workflow_dispatch: # 手动触发
    inputs:
      version:
        description: '触发原因（选填）'
        required: false
        default: '手动触发'
      ref:
        description: '分支（选填）'
        required: false
        default: ''
        type: string
      package:
        description: '子包'
        required: true
        type: choice
        options:
          - core
          - all
        default: 'all'
        
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
    # permissions:
    #   packages: write
    #   contents: write
    #   id-token: write
    # 复合条件判断（自动触发检查提交信息，手动触发直接放行）
    # contains 函数
    # startsWith 函数
    # endsWith 函数
    if: |
      (github.event_name == 'push' && startsWith(github.event.head_commit.message, 'version')) ||
      github.event_name == 'workflow_dispatch'
    steps:
      - name: 代码检出
        uses: actions/checkout@v4
        with:
          ref: \${{ github.event.inputs.ref || github.ref_name }}
          fetch-depth: 0

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
          
      - name: 安装全局依赖
        run: |
          ${createCI()}
          cd scripts
          chmod +x detect_changes.sh workflow_dispatch.sh pub.sh
          # chmod +x scripts/detect_changes.sh
          # chmod +x scripts/workflow_dispatch.sh
          # chmod +x scripts/pub.sh

      - name: 检测子包变更情况（推送代码时触发）
        if: github.event_name == 'push'
        id: detect-changes
        run: |
          ./scripts/detect_changes.sh

      - name: 检测子包变更情况（手动触发时触发）
        if: github.event_name == 'workflow_dispatch'
        id: workflow-changes
        env:
          INPUT_PACKAGE: \${{ github.event.inputs.package }}
        run: |
          ./scripts/workflow_dispatch.sh

      - name: 设置工作根路径
        run: |
          echo "REPO_ROOT=$(pwd)" >> $GITHUB_ENV

      - name: 发布到 npm
        if: \${{ env.update_packages && env.update_packages != '' }}
        env:
          NPM_CONFIG_USERCONFIG: /dev/null # 强制忽略本地配置
          UPDATE_PACKAGES: \${{ env.update_packages }}
          REPO_ROOT: \${{ env.REPO_ROOT }}
        run: |
          ./scripts/pub.sh

  `,
  );
}
