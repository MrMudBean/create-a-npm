# 构建简单的 npm 库

[![version](<https://img.shields.io/npm/v/create-a-npm.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/create-a-npm) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/MrMudBead/create-a-npm/issues)

> [info]
> 广告时间到，推荐 [vscode 插件](https://marketplace.visualstudio.com/items?itemName=MrMudBean.auto-last-modified) 自动添加文件头部注释

## 安装

该库不安装亦可直接使用 `npm create a-npm` 全局使用，如果你非要安装的话，就：

```bash
npm install  -g create-a-npm
```

## 使用

```bash
# 最简单的使用方式
npm create a-npm
# 指定使用 pnpm 作为 Node.js 包管理器
npm create a-npm -- -m=pnpm
# 指定使用 yarn 作为 Node.js 包管理器
npm create a-npm -- -m=yarn
```

在使用中，会在用户的目录下创建 `.earthnut.dev.data/create-a-npm/config` 文件，以储存您的数据在本地（这些数据不会走网络，安全可用）方便下次使用时直接使用。_若觉得无用，可执行删除_，**_若觉得不知而误删除，下次后还需再次输入您的使用数据。_**所以，建议保留数据：

- linux: /home/`username`/earthnut.dev.data/create-a-npm/config
- macOS: /Users/`username`/earthnut.dev.data/create-a-npm/config
- Windows: C:\Users\`username`\earthnut.dev.data\create-a-npm\config

(尚未在 windows 上进行全量测试)
在使用 `npm create a-npm` 命令后，即开始构建步骤

- 步骤一：询问包将使用的 Node.js 包管理器（如果没有在启动时指定）
- 步骤二：询问并获取输入包名
- 步骤三：校验包名是否以有 npm 同名包。如果有同名的包存在，询问是否更改、忽略或退出
- 步骤四：查找本地是否储存了相关的数据，没有信息将直接问询输入
- 步骤五：选择开发的模式（是否携带 `bin` ）
- 步骤六：选择使用的辅助工具

### 输入包名

正常使用输入包名，该步骤不可被跳过。

- 仅接受小写英文字符和数字
- 首字符仅接受小写英文字符或 `@`
- `@` 仅可出现在首位
- 仅在首位出现 `@` 时使用 `/`
- 仅可用 `-`、`_` 作为分割符

```bash
▶︎ *您即将创建的包名*:  连字符(-)做分隔符
```

如果没有输入或是不符合要求，则将触发以下输入判断：

输入空格、首字符非小写英文或 `@` 的提示

```bash
▶︎ *您即将创建的包名*: 1
首字符应为小写英文字符或 @
```

非法使用 `@` 时的反馈

```bash
▶︎ *您即将创建的包名*:  a@
@ 仅允许在首位出现
```

使用非法的字符

```bash
▶︎ *您即将创建的包名*:  a、
仅允许 -、_ 字符出现
```

### 校验包名

当包名在当前执行目录下存在同名的包时，会提示更换包名或退出

```bash
▶︎ 当前目录下存在非空同名文件夹（create-a-npm): 更换为其他名称  直接退出
```

当包名在同目录下不存在同名的文件夹，开始校验该包名是否存在于 [npm](https://registry.npmjs.org/)

```bash
▶︎ 当前包名称（create a npm）已经存在于 npm 中: 更改为其他名称  忽视并继续  直接退出
```

### 使用数据

在构建中，会用到一个用于发布者姓名的 `name` 和一个用于包通讯的 `email` 、一个用于展示的个人网址 `url`

```bash
 □ name : earthnutDev
 □ email : earthnut.dev@outlook.com
 □ url : https://earthnut.dev
```

### 选择开发模式

完善了个人信息后就进入了开始模式选择，可以使用库模式、执行库模式或混合模式

```bash
▶︎  请选择开发模式

 ● 仅是可用库
 ◦ 仅是可执行库
 ◦ 库 + bin
```

### 选择使用的工具

默认是全选的状态，且 `rollup` 状态只读

```bash
 ▣ 打包工具 rollup
 ■ 使用 typescript
 ■ 使用代码问题工具 eslint
 ■ 格式化代码 prettier
 ■ git 提交 hook 管理 husky
 ■ CI/CD 使用自动化构建、发布 github action
```

### 是否安装依赖

在快结束的时候会提醒是否直接安装依赖包，该步骤可被跳过。完成或跳过该步骤即完成了简单的包创建

## 📄 文档地址

参看 [https://earthnut.dev/npm/create-a-npm/](https://earthnut.dev/npm/create-a-npm/)
