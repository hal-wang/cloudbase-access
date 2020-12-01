## cloudbase-access demo

cloudbase-access 用法演示

## 一个简单的 todo API

没有访问数据库，只有模拟账号，在 `lib/Global.ts` 中。

1. account: abc, password: 123456
1. account: admin, password: abcdef

## 编译

本示例使用 `ts` 写的，需要编译后发布至自己的 cloudbase。

运行以下命令编译：

```shell
cd functions/cloudbase-access-demo
npm run build
```

会在云函数根目录（functions/cloudbase-access-demo）生成以下文件/文件夹

- controllers：符合 cloudbase-access 规则的 Controllers 目录
- lib：除 controllers 外的其他类
- index.d.ts：没有用
- index.js：入口文件

## 发布

修改 `/cloudbaserc.json` 文件，将 `evnId` 值改为你自己的 cloudbase 环境

```JSON
"envId": "env-***",
```

在已经安装 `Tencent CloudBase Toolkit` 插件的 vscode 中，右键点击 `cloudbase-access-demo` 文件夹，选择云部署云函数（云端安装依赖）。首次操作可能会让登录。

发布后，在云函数控制台，配置 HTTP 访问服务。

## 调用 API

使用 `vscode` 插件 `REST Client` 测试，测试文件都是以 `.test.txt` 结尾

`vscode` 安装插件后，打开 `.test.txt` 文件，快捷键 `Ctrl + Alt + R` 可测试

目前测试的 API，环境是本人免费 `cloudbase` 环境，不保证长期有效。使用前请将 `cloudbase` 环境改为你自己的。

如

```txt
POST https://env-***.service.tcloudbase.com/cloudbase-access-demo/user/login
content-type:application/json

{
  "account":"abc",
  "password":"123456"
}
```

## 权限认证

示例只写了 `login`、`admin` 两个身份，实际业务需要访问数据库来验证访问权限。

其中，`login` 权限在示例中，是根据头部的 `account` 和 `password` 验证的。在实际业务中，`password` 可能会加密，或者使用 `token` 方式等。
