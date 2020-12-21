利用 NodeJS 和 CloudBase 快速创建 MVC 架构的 Serverless RESTful Api

## 安装

npm i @hal-wang/cloudbase-access

## 示例

示例请查看后面的 [#Demo](#Demo)

或者查看本项目 `test` 文件夹中的一些单元测试。

## Router

路由管理类，也是 `cloudbase-access` 的控制中心。构造函数传入环境 `event`。

如在 `main` 函数中：

```ts
import { Router } from "@hal-wang/cloudbase-access";
export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  const router = new Router(event, context);
  return (await router.do()).result;
};
```

以上几行代码即创建一个简单的 MVC 架构的 API。

如果访问的路径不存在，会返回 404 NotFound 结构。

### 权限

`Router` 第三个参数（可选）传入权限认证对象，详情后面 [权限](#权限) 部分有介绍。

### controllers 目录

`Router` 第四个参数（可选）传入 `controllers` 目录名称，默认为 `controllers`。

MVC 架构的 `controllers` 统一放在一个文件夹中，建议不传此参数，即 `controllers`。

在 `controllers` 目录中，建立各 `controller` 文件夹，再在 `controller` 文件夹中建 `action` 文件。详情后面 [Action](#Action) 部分有介绍。

## HttpResult

`HttpResult` 封装了 HTTP 返回结构。可在构造函数传入相关参数。

`HttpResult` 有个 `get` 属性 `result` ，可获取最终 HTTP 返回结构。

### 内置类型

目前 `HttpResult` 内置一些返回类型，都是以静态方式调用：

- ok, 200
- accepted, 202
- noContent, 204
- partialContent, 206
- badRequest, 400
- forbidden, 403
- notFound, 404
- errRequest, 500

```TS
return HttpResult.ok("success");
```

内置类型都支持传入`body`可选参数，API 返回为 body 内容。

### 举例

以下例子中返回 200 请求成功：

```ts
import { HttpResult } from "@hal-wang/cloudbase-access";
return HttpResult.ok({
  list: [],
  count: 0,
});
```

以下例子中返回 400 请求错误：

```TS
import { HttpResult } from "@hal-wang/cloudbase-access";
return HttpResult.badRequest("请求错误");
```

### 在 Action 中

在 `Action` 中已经加入了 `HttpResult` 内置函数，可以直接以 `this.func` 方式调用

```TS
import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.noContent();
    // or return this.ok('success');
  }
}
```

## 请求参数

`RequestParams` 类解析并封装请求参数，构造函数传入云函数 `event`。

实例包含以下字段：

1. event，云函数环境 event
2. headers, 请求头部
3. path，访问路径，如`POST https://api.com/user/login`，path 值为`/user/login`
4. params，查询参数
5. data，请求 body，如果是 JSON 字符串，则转为 JSON 对象

在 Router 中，有 `RequestParams` 实例对象 `requestParams`，可通过 `this.requestParams.headers` 方式使用

## Action

每次调用 API，如果顺利进行，主要执行的是 `Action` 中的 `do` 函数。

所有 `Action` 都应派生自 `Action` 类，并重写 `do` 函数。

### 新建文件

- 在云函数根目录（即与 index.ts 同级）创建名为`controllers`文件夹。也可以为其他，需要在 Router 构造函数第四个参数可以指定，默认为`controllers`
- 根据各业务，创建不同 controller 文件夹，名称自定，但名称与路由名称对应。
- 在 controller 文件夹中，创建`.ts`文件，每个`.ts`文件对应一个`action`
- 在`.ts`文件中创建类，并继承 `Action`，重写 `do` 函数

```ts
import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.noContent();
  }
}
```

比如你需要一个用户登录的 API，那么路径应如下（user 和 login 名称自定）：

```
/controllers/user/login.ts
```

### Action 文件内容

在`.ts`文件中，模块返回一个类，该类继承 `Action`，构造函数有一个字符串数组参数，传入为权限角色。

如判断调用需要登录：

```TS
['login']
```

如判断调用者是管理员：

```TS
['admin']
```

具体判断方式，参考前面说的权限部分。

例 1

```ts
import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.data

    if(/*账号或密码错误*/) return this.notFound('账号或密码错误')
    return this.ok(new {/*返回信息*/})
  }
}
```

例 2

```ts
import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  constructor() {
    super(["login"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.headers; // 在auth中已经验证 account 的正确性，因此可认为调用者身份无误。

    const todoList = []; // 可放心从数据库读取用户数据，因为 account 已验证
    return this.ok(todoList);
  }
}
```

## 中间件

所有中间件应派生自类 `Middleware`，中间件有几种类别：

1.  BeforeStart `Router` 初始化时就调用，此时 `Action` 未被加载
1.  BeforeAction `Action` 执行前调用
1.  BeforeEnd `Action` 执行后调用
1.  BeforeSuccessEnd `Action` 执行后，而且返回结果为 2xx 时调用
1.  BeforeErrEnd `Action` 执行后，而且返回结果不为 2xx 时调用

中间件都必须实现 `do` 函数，返回 `HttpResult` 。如果返回为 `null`，则执行成功，否则 API 此次调用结束，返回中间件结果。

使用 router.configure 注册中间件，如

```ts
import { Router } from "@hal-wang/cloudbase-access";
export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  const router = new Router(event, context);
  router.configure(new YourMiddleware());

  return (await router.do()).result;
};
```

## 权限

`Router` 构造函数第三个参数是权限验证 `Authority` 对象。

你需要新写个类，继承 `Authority`，并实现 `do` 函数。

其实 `Authority` 也是个中间件，只是加载方式较特殊。当然你也可以自己写个权限管理中间件。

权限是用于判断用户能否使用 API。下例使用请求头部的账号信息验证调用者信息，用法如下：

```ts
class Auth extends Authority {
  async do(): Promise<HttpResult> {
    if (!this.roles || !this.roles.length) return null;

    if (this.roles.includes("login") && !this.loginAuth()) {
      return HttpResult.forbidden("账号或密码错误");
    }

    return null;
  }

  loginAuth() {
    const { account, password } = this.requestParams.headers;
    return account == "abc" && password == "123456";
  }
}

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  const router = new Router(event, context, new Auth());
  return (await router.do()).result;
};
```

## Demo

Demo 内容在本项目 `demo` 文件夹，演示 `cloudbase-access` 用法。

### 一个简单的 todo API

没有访问数据库，只有模拟账号，在 `lib/Global.ts` 中。

1. account: abc, password: 123456
1. account: admin, password: abcdef

### 发布

本示例是使用 `ts` 写的，需要编译后发布至自己的 cloudbase。

修改 `/cloudbaserc.json` 文件，将 `evnId` 值改为你自己的 cloudbase 环境

```JSON
"envId": "env-***",
```

运行以下命令发布：

```shell
cd demo/cloudbase-access-demo
npm install
npm run build:cad
```

首次发布需要登录。发布成功后，在 `CloudaBase` 云函数控制台，配置 HTTP 访问服务。

#### 生成的内容

编译后会在云函数目录 `functions` 生成文件夹 `cad`，

在 cad 文件夹中包含以下内容：

- controllers：符合 cloudbase-access 规则的 Controllers 目录
- lib：除 controllers 外的其他类
- index.js：入口文件

### 调用 API

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

### 权限认证

示例只写了 `login`、`admin` 两个身份，实际业务需要访问数据库来验证访问权限。

其中，`login` 权限在示例中，是根据头部的 `account` 和 `password` 验证的。在实际业务中，`password` 可能会加密，或者使用 `token` 方式等。
