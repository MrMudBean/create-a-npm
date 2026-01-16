# 构建一个符合泥豆君规则的 npm 简单包

## 1.1.0 (2026-1-16)

- 重写了部分逻辑
- **`tsconfig.base.json`** ：
  - 高版本的 `typescript` 建议添加 `"forceConsistentCasingInFileNames": true` 降低在不同设备的性能
  - 在 `TypeScript 7.0` 将移除 `baseUrl` ，所以使用 `"rootDir": "."` 代替
  - `tsconfig.type.json` 的 `declarationDir` 不再于 `dist` 下，而是放到了 `dist/es` 下，简化打包后文件结构
- **"rollup"**
  - 打包入口由 `./index.{js,ts}` 变成了 `./src/index.{js,ts}`
  - 打包文件出口调整
  - 当为 bin 模式，添加 `rollup-rollup-license` 插件
- **eslint** ：
  - 生成判定错误，导入信息有误
  - 规则调整
- **"package.json"** ：
  - 更改 `eslint` 的钩子名称 `eslint` ➞ `lint`
    - 更改 "eslint" 执行添加 `--fix` 参数
  - 更改 `prettier` 的钩子名称 `prettier` ➞ `beautify`
- **action** ：
  - 由于 npm 的验证策略调整，现在不再推荐使用 token 验证，而是在 `https://www.npmjs.com/package/xxxx/access` 配置指定的可推送的 github/gitlab 执行推送 CI/CD 文件的模式，所有对原构建的 "发布.yaml" 文件内容做了调整
- **index.{js,ts}** ： 入口文件从根移到了 "src/" 下
- **LICENSE** ： 版权的 `c` 改成了 `©️`

## v1.0.7 (2025-8-1)

- 修复推送逻辑

## v1.0.6 (2025-7-28)

- 更改了初始化包强制使用 'npm' 作为 Node.js 管理器，可使用启动参数 `-m` 指定包管理者，或者在应用开始时进行选择。

## v1.0.6-test.0 (2025-7-24)

- 么事

## v1.0.5 (2025-7-19)

- 么事

## v1.0.4 (2025-6-22)

- 更新打包模式，将少安装包体积

## v1.0.3 (2025-6-22)

- 修复已知 bug

## v1.0.2 (2025-6-14)

- 修复已知 bug

## v1.0.1 (2025-6-14)

- 该库开发较早，使用较落后的开发逻辑，导致 `ReadMe.md` 文件存在且追踪在记录。而后更改 `README.md` 名在 mac 上并未触发更名的识别，依旧以 `ReadMe.md` 存在。导致使用 github action 发布 npm 后 `README.md` 文件丢失。
- 一般的包都会在构建的时候移除 `devDependencies` ，而该包较为特殊，移除了该内容后将导致版本使用较低或错误

## v1.0.1-canary.20250614 (2025-6-14)

- 测试

## v1.0.0 (2025-6-13)

- 缝缝补补，终于新版本现世了

## v0.0.4 _12.15.2024_

- 修复已知错误

## v0.0.3 _8.28.2024_

- 依赖更新
  - @eslint/js 版本从 v9.8.0 更新到 v9.9.1
  - @types/node 版本从 v20.14.13 更新到 v20.16.2
  - rollup 版本由 v4.19.2 更新到 v4.21.1
  - a-node-tools 版本由 v0.0.4 更新到 v0.0.5
- 维护了创建后的包测试
- 维护了 .gitignore 文件内容，将内容 `list` 改为 `dist`
- 维护部分文件头部注释

## v0.0.2 _8.13.2024_

- 修复已知问题

## v0.0.1 _7.12.2024_

- 初始化
