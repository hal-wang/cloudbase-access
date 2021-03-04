---
title: cba-todo
---

# cba-todo

## web

<https://cba-todo.hal.wang>

## docs

[https://cba-todo.hal.wang/docs](/docs)

## api

the API documents are generated automatically by `cba`

[https://cba-todo.hal.wang/docs/api](/docs/api)

## 一键部署

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Fcloudbase-access&workDir=demo%2Fcba-todo&branch=main)

## 简介

API 使用了 `cloudbase-access` 符合 `RESTFul` 规范的 API 格式，并且设置 `router.isMethodNecessary = true;`。

使用了数据库两个文档：`cba-user`, `cba-todo`。

测试账号：

- email: `test@hal.wang`
- password: `123456`。

## Fork

你也可以 Fork 本项目后，修改示例项目中的 `.env` 文件中的 `ENV_ID`，值为你的 cloudbase 环境 id 如 `your_name-***`

在示例项目目录下（`demo/cba-todo`），执行以下语句发布 `npm run deploy`

## build 生成的内容

API 编译后会在云函数目录 `functions` 生成文件夹 `cba-todo`，

在 `cba-todo` 文件夹中包含以下内容：

- controllers：符合 `cba` 规则的 `controllers` 目录
- lib：除 `controllers` 外的其他帮助类
- models: ts model
- middlewares: 中间件
- index.js：入口函数

web 编译后会生成 `cba-todo-web/dist` 目录，发布的 web 是此文件夹中的内容

docs 编译后生成 `cba-todo-web/public/docs` 目录，发布 web 时会自动编译并一起发布

## 调用 API 测试

测试文件都在 `cba-todo-api/rest-test`文件夹中，并且以 `.test.txt` 结尾

使用 `vscode` 插件 `REST Client` 测试，安装插件后，打开 `.test.txt` 文件，快捷键 `Ctrl + Alt + R` 可测试调用

目前测试的 API，环境是本人免费 `cloudbase` 环境，不保证长期有效。使用前请将 `cloudbase` 环境改为你自己的

如

```txt
GET https://cba-todo-1g7uooof7a2578d7-1253337886.ap-shanghai.app.tcloudbase.com/cba-todo/user/test@hal.wang
content-type:application/json
password:123456
```

```txt
POST https://cba-todo-1g7uooof7a2578d7-1253337886.ap-shanghai.app.tcloudbase.com/cba-todo/user
content-type:application/json

{
  "account": "test@hal.wang",
  "password":"123456"
}
```

## 权限认证

### 身份

示例写了 `hl`、`ql`、`admin` 三个身份

#### hl

即 `header login`，通过 `header` 的 `account` 和 `password` 验证登录

#### ql

即 `query login`, 通过 `query` 的 `account` 和 `header` 的 `password` 验证登录

#### admin

验证 `header`或 `query` 中的 `account` 是否管理员

### 实际业务

在实际业务中，`password` 可能会加密，或者使用 `token` 方式等，验证方法与 `demo` 类似
