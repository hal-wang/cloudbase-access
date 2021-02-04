# cloudbase-access ( cba )

利用 NodeJS 和 CloudBase 快速创建 Serverless RESTful Api

## 安装

npm i @hal-wang/cloudbase-access

## 示例

示例请查看后面的 [#Demo](##Demo)

或者查看本项目 `test` 文件夹中的一些单元测试。

## 建议

强烈建议使用 `typescript` 并生成 `javascript`代码后上传，可参考 [#Demo](##Demo)。理论上 `javascript` 完全没问题，但作者并未进行测试。

## Router

路由管理类，也是 `cba` 的控制中心。构造函数传入环境 `event` 和 `context`。

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

以上几行代码即创建一个简单的 RESTful 规范的 API。

如果访问的路径不存在，会返回 404 NotFound 结构。

### 权限参数

`Router` 第三个参数（可选）传入权限认证对象，详情后面 [权限](#权限) 部分有介绍。

### controllers 目录

`Router` 第四个参数（可选）传入 `controllers` 目录名称，默认为 `controllers`，建议不传此参数，即 `controllers`。

所有 `controllers` 统一放在这个文件夹中，在 `controllers` 目录中，建立各 `controller` 文件夹，再在 `controller` 文件夹中建 `action` 文件。详情后面 [##Action](##Action) 部分有介绍。

### 路由匹配

在`cba`中，路由与文件系统匹配。

路由查询参数命名以 `^` 开头（文件系统中命名不允许出现字符 `:`），如果存在多个查询参数则后面的会覆盖前面的，如 `get user/^id/todo/^id`，则 `id` 值为 `todoId`。正确命名应如 `user/^userId/todo/^todoId`。

如果限制 `httpMethod`, `action` 应以 `post.ts`、`get.ts`、`delete.ts`、`patch.ts`、`put.ts` （或 `.js` ）命名，否则任意 `httpMethod` 都可以访问。

#### isMethodNecessary

如果设置 `router.isMethodNecessary = true;`, 则所有 `Action` 必须严格使用 `httpMethod` 命名，与 RESTFul 规范相符。否则会找不到路由并返回 `404`。

如果 `isMethodNecessary` 为 `false` 或不设置，则 RESTFul 规范的 API 可能会以非 RESTFul 方式调用。如路由 `user/login`，本应是 `get user/login`，但 `post user/login/get` 也能调用。因此如果使用 RESTFul，建议设置 `isMethodNecessary` 为 `true`。

#### 例 1

获取 todo list

##### 方式 1

目录结构如下：

```
+-- controllers
|   +-- todo
|       +-- get.ts
```

访问地址为 `get /todo`，

##### 方式 2

目录结构如下：

```
+-- controllers
|   +-- todo
|       +-- getTodoList.ts
```

访问地址为 `get /todo/getTodoList` 、 `post /todo/getTodoList` 、 `put /todo/getTodoList` 等等，效果相同。

#### 例 2

获取单个 todo item

##### 方式 1

目录结构如下：

```
+-- controllers
|   +-- todo
|       +-- ^id
|           +-- get.ts
```

访问地址为 `get /todo/66`

##### 方式 2

目录结构如下：

```
+-- controllers
|   +-- todo
|       +-- getTodoItem.ts
```

访问地址为 `get(post 等) /todo/getTodoItem`，需要在 `body` 、 `header` 或 `queryParams` 传入 `todoId` 参数

#### 示例建议

上述两个示例都给了两种定义方式。

cloudbase 云函数没有限制 httpMethod，但建议使用方式 1 更符合规范，易读性也更好。

因此建议设置 router.isMethodNecessary 为 true 。

## HttpResult

`HttpResult` 封装了 HTTP 返回结构。可在构造函数传入相关参数。

`HttpResult` 有个属性 `result` ，可获取最终 HTTP 返回结构 `HttpResultStruct` 。

### 内置类型

目前 `HttpResult` 内置一些返回类型，都是以静态方式调用：

- ok, 200
- accepted, 202
- created, 201
- noContent, 204
- partialContent, 206
- redirect, 30\*
- badRequest, 400
- badRequestMsg, 400
- forbidden, 403
- forbiddenMsg, 403
- notFound, 404
- notFoundMsg, 404
- methodNotAllowed, 405
- errRequest, 500
- errRequestMsg, 500

```ts
return HttpResult.ok("success");
```

普通内置类型支持传入 `body` 可选参数，`body` 为返回的内容。
API 返回错误时，可统一返回 `ErrorMessage`，命名以 `Msg` 结尾的内置类型接受 `ErrorMessage` 参数。

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

```ts
import { HttpResult } from "@hal-wang/cloudbase-access";
return HttpResult.badRequestMsg({ message: "请求错误" });
// 或 return HttpResult.badRequest("请求错误");
```

### 在 Action 中

在 `Action` 中已经加入了 `HttpResult` 内置函数，可以直接以 `this.func` 方式调用

```ts
import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.noContent();
    // or return this.ok('success');
  }
}
```

## 请求参数

`RequestParams` 类解析并封装请求参数，构造函数传入云函数 `event` 和 `context`。

在 `Action` 中，有 `RequestParams` 实例对象 `requestParams`，可通过 `this.requestParams` 方式使用。

实例包含以下字段

### event

云函数环境 event

### context

云函数环境 context

### path

访问路径，如`POST https://domain.com/api/user/login`，path 值为`user/login`。

_注意：在 event 中，path 实为 `/` 开头，上例为 `/user/login`。但在 `cba` 中移除了开头的 `/`_

### headers

请求头部

### params

查询参数

### data

请求 body，如果是 JSON 字符串，则转为 JSON 对象。

在 event 中，json 为字符串，在 `RequestParams` 中已解析。

### query

v0.9.0 中新增。

RESTFul 规范的路径中查询参数。如 `user/:id` 调用时是 `user/66`，在 query 中即存在

```ts
query.id == "66"; // true;
```

## Action

每次调用 API，如果顺利进行，主要执行的是 `Action` 中的 `do` 函数。

所有 `Action` 都应派生自 `Action` 类，并重写 `do` 函数。

### 创建一个 Action

1. 在云函数根目录（即与 index.ts 同级）创建名为`controllers`文件夹。也可以为其他，需要在 Router 构造函数第四个参数可以指定，默认为`controllers`
1. 根据各业务，创建不同 controller 文件夹，名称自定，但名称与路由名称对应。
1. 在 controller 文件夹中，创建`.ts`文件，每个`.ts`文件对应一个`action`
1. 在`.ts`文件中创建类，并继承 `Action`，重写 `do` 函数

```ts
import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.noContent();
  }
}
```

### Action 文件内容

在`.ts`文件中，模块返回一个类，该类继承 `Action`，构造函数有一个可选参数，传入字符串数组，值为允许的权限角色。

如判断调用需要登录信息：

```ts
["login"];
```

如判断调用者是管理员：

```ts
["admin"];
```

具体判断方式，参考后面的 [权限](#权限) 部分。

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

    const todoList = []; // 可放心从数据库读取用户数据，因为 account 已验证登录
    return this.ok(todoList);
  }
}
```

## 中间件

中间件可以在 API 每次调用的生命周期各个阶段执行，如记录日志，验证权限等。

所有中间件应派生自类 `Middleware`，实现 `do` 函数，返回 `MiddlewareResult`

### 中间件类型

在 `cba` 中，中间件有以下几种类别：

1.  BeforeStart： `Router` 初始化时就调用
1.  BeforeAction： `Action` 执行前调用
1.  BeforeEnd： `Action` 执行后调用
1.  BeforeSuccessEnd： `Action` 执行后，而且返回结果为 2xx 时调用
1.  BeforeErrEnd： `Action` 执行后，而且返回结果不为 2xx 时调用

类型为 `BeforeStart` 的中间件执行时，`Action` 未被加载，因此无法获取 `query`, `roles` 等。

类型为 `BeforeStart` 和 `BeforeAction` 的中间件执行时，`Action` 未执行，因此无法获取 `Action` 执行结果。

### 中间件结果

```ts
// 成功
return new MiddlewareResult(true);
// 或
return MiddlewareResult.getSuccessResult();

// 失败
return new MiddlewareResult(
  false,
  HttpResult.badRequestMsg({ message: "中间件调用失败" })
);
// 或
return MiddlewareResult.getFailedResult(
  HttpResult.badRequestMsg({ message: "中间件调用失败" })
);
```

如果返回失败，则 API 此次调用结束，返回中间件结果。

### 注册中间件

你需要使用 router.configure 注册中间件，如

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

其实 `Authority` 也是个中间件，只是加载方式较特殊。当然你也可以自己写个权限管理中间件，效果可以与 `Authority` 相同。

权限是用于判断用户能否使用 API，可以精确到控制每个 `Action` 。下例使用请求头部的账号信息验证调用者信息，用法如下：

```ts
class Auth extends Authority {
  async do(): Promise<MiddlewareResult> {
    if (!this.roles || !this.roles.length) {
      return MiddlewareResult.getSuccessResult();
    }

    if (this.roles.includes("login") && !this.loginAuth()) {
      return MiddlewareResult.getFailedResult(
        HttpResult.forbidden("账号或密码错误")
      );
    }

    return MiddlewareResult.getSuccessResult();
  }

  loginAuth() {
    // 实际情况应该需要查表等复杂操作
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

## cba-map

`cba-map` 是可选的，它能提升路由匹配速度，其本身为 json 文件，并且要上传至 `cloudbase`云函数根目录。

### 建议使用

如果不使用`cba-map`，路由匹配方式是先遍历 `controllers` 中的各个 `action`，再进行匹配，如果项目较大可能会影响匹配速度。

在 100 个 `action` 的项目中，经测试`cba-map`提升路由匹配速度大概 20 倍左右（有 `cba-map` 耗时 1-2ms，无`cba-map`耗时 30-40ms）。因此在 `action` 数量较多时建议使用 `cba-map`。

### 使用方式

在 package.json 文件中的 scripts 中添加

```json
  "scripts": {
    "cba-map": "cba-map dist/controllers",
  },
```

`dist/controllers` 应改为你的 js 文件的 `controllers` 目录路径。在 ts 项目中，应该是执行 tsc 生成的 js 目录。

执行 `npm run cba-map` 会以`dist/controllers`目录，在项目目录下生成 `cba-map.json` 文件（建议将其加入 `.gitignore`文件）。

## Demo

Demo 内容在本项目 `demo` 文件夹，用于演示 `cba` 用法。

### 一个简单的 todo API

使用了 `RESTFul` 规范的 API 格式，并且设置 `router.isMethodNecessary = true;`。

使用了数据库两个文档：`cba-user`, `cba-todo`。

测试账号为 `test@hal.wang` 并且无法更改，管理员账号为 `support@hal.wang`。您可以在`Global.ts`中修改以上账号。

### 发布

本示例是使用 `ts` 写的，需要编译后发布至自己的 cloudbase。

修改 `/.env` 文件，将 `ENV_ID` 值改为你自己的 cloudbase 环境 id.

```
ENV_ID=env-***
```

运行以下命令发布：

```shell
cd demo/cba-todo/cba-todo-api
npm install
npm run build
```

首次发布需要登录。发布成功后，在 `CloudaBase` 云函数控制台，配置 HTTP 访问服务。

#### 生成的内容

编译后会在云函数目录 `functions` 生成文件夹 `cba-todo`，

在 `cba-todo` 文件夹中包含以下内容：

- controllers：符合 `cba` 规则的 `controllers` 目录
- lib：除 `controllers` 外的其他帮助类
- models: ts model
- index.js：入口函数

### 调用 API 测试

测试文件位于 `rest-test` 文件夹中

使用 `vscode` 插件 `REST Client` 测试，测试文件都是以 `.test.txt` 结尾

`vscode` 安装插件后，打开 `.test.txt` 文件，快捷键 `Ctrl + Alt + R` 可测试

目前测试的 API，环境是本人免费 `cloudbase` 环境，不保证长期有效。使用前请将 `cloudbase` 环境改为你自己的。

如

```txt
POST https://env-***.service.tcloudbase.com/cba-todo/user/login
content-type:application/json

{
  "account":"abc",
  "password":"123456"
}
```

### 权限认证

#### 身份

示例写了 `hl`、`ql`、`admin` 三个身份

##### hl

即 `header login`，通过 `header` 的 `account` 和 `password` 验证登录

##### ql

即 `query login`, 通过 `query` 的 `account` 和 `header` 的 `password` 验证登录

##### admin

验证 `header`或 `query` 中的 `account` 是否管理员

#### 实际业务

在实际业务中，`password` 可能会加密，或者使用 `token` 方式等，验证方法与 `demo` 类似
