# cloudbase-access ( cba )

利用 NodeJS 和 CloudBase 快速创建 Serverless RESTful Api

## 安装

npm i @hal-wang/cloudbase-access

## 示例

### todo

一个简易的 todo 项目，包含后端和前端，详情请查看 <https://todo.hal.wang/docs>

线上示例：<https://todo.hal.wang>

一键部署：[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Ftodo&branch=main)

### short-url

使用自己的域名简化链接，详情请查看 <https://github.com/hal-wang/short-url>

线上示例：<https://s.hal.wang>

一键部署：[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Fshort-url&branch=main)

### wedding-card

网络喜帖，能够生成邀请二维码。详情请查看 <https://github.com/hal-wang/wedding-card>

线上示例：<https://wedding.hal.wang>

一键部署：[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Fwedding-card&branch=main)

## 关于 CBA 的建议

强烈建议使用 `typescript` 并生成 `javascript` 代码后上传，可参考以上示例，做法是 ts 生成 js 文件，并用脚本删除 `.d.ts` 文件。

理论上 `javascript` 完全没问题，但作者并未进行测试。

## Router

路由管理类，也是 `cba` 的控制中心。构造函数传入环境 `event` 和 `context`。

如在 `main` 函数中：

```ts
import { Router } from "@hal-wang/cloudbase-access";
export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  const startup = new Startup(event, context);
  return (await startup.do()).result;
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

#### X-HTTP-Method-Override

如果请求头部包含 `X-HTTP-Method-Override` 参数，则访问方法以 `X-HTTP-Method-Override` 值为准

比如 Action 要求 `PATCH` 请求，但微信小程序不支持 `PATCH`，那么可以使用 `POST` 访问，并在头部加上此参数，值为 `PATCH`

```JSON
"headers":{
  "X-HTTP-Method-Override":"PATCH"
}
```

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
import { Action } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<void> {
    this.noContent();
    // or this.ok('success');
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
import { Action } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<void> {
    return noContent();
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
import { Action } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<void> {
    const { account, password } = this.requestParams.data

    if(/*账号或密码错误*/) return this.notFound('账号或密码错误')
    this.ok(new {/*返回信息*/})
  }
}
```

例 2

```ts
import { Action } from "@hal-wang/cloudbase-access";

export default class extends Action {
  constructor() {
    super(["login"]);
  }

  async do(): Promise<void> {
    const { account } = this.requestParams.headers; // 在auth中已经验证 account 的正确性，因此可认为调用者身份无误。

    const todoList = []; // 可放心从数据库读取用户数据，因为 account 已验证登录
    this.ok(todoList);
  }
}
```

## 中间件

中间件可以在 API 每次调用的生命周期各个阶段执行，如记录日志，验证权限等。

所有中间件应派生自类 `Middleware`，实现 `do` 函数，返回 `MiddlewareResult`

### 中间件类型

在 `cba` 中，中间件有以下几种类别：

1.  BeforeStart： `Action` 初始化前调用
1.  BeforeAction： `Action` 执行前调用
1.  BeforeEnd： `Action` 执行后调用
1.  BeforeSuccessEnd： `Action` 执行后，而且返回结果为 2xx 时调用
1.  BeforeErrEnd： `Action` 执行后，而且返回结果不为 2xx 时调用

类型为 `BeforeStart` 的中间件执行时，`Action` 未被加载，也未进行路由匹配，因此无法获取 `query`, `roles` 等。

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
): Promise<unknown> => {
  const startup = new Startup(event, context);
  router.configure(new YourMiddleware());
  return (await startup.do()).result;
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
): Promise<unknown> => {
  const startup = new Startup(event, context, new Auth());
  return (await startup.do()).result;
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

## cba-doc

`cba` 支持自动化文档创建，目前已支持输出 `md` 格式文档。

文档的编写支持两种方式：

1. 给 `Action` 类实例对象的 docs 属性赋值
2. 按特定格式注释 `Action` 定义文件

### 使用方式

在 package.json 文件中的 scripts 中添加

```json
  "scripts": {
    "cba-doc": "cba-doc dist/controllers doc.md doc.config.json",
  },
```

`cba-doc` 命令传入三个参数

1. js 文件的 `controllers` 目录路径。在 ts 项目中，应该是执行 tsc 生成的 js 目录
2. 目标文件相对路径
3. 配置文件路径

执行 `npm run cba-doc`

### `action` 注释

参考如下格式在文件任意处注释：

```
/**
 * @action delete docs
 *
 * a docs test named delete
 *
 * @parts test1 test2 custom
 * @input
 * @@headers
 * @@@test-header1 {string} a test header of deleting docs NO.1
 * @@@test-header2 {number}
 * @@@test-header3 {object} a test header of deleting docs NO.3
 * @@@@test-header31 {string} a test header of deleting docs NO.3.1
 * @@@@test-header32 {number} a test header of deleting docs NO.3.2
 * @@@test-header4 a test header of deleting docs NO.4
 * @@@test-header5 {number} a test header of deleting docs NO.5
 * @@body {object} ok result
 * @@@method {string} http method
 * @@params
 * @@query
 * @output
 * @@codes
 * @@@200 success
 * @@@404
 * @@body
 * @@@method {string} http method
 */
```

`@` 的数量可对比 JSON 对象的深度，其中一级和二级是固定的，如 `@action`、`@parts`、`@input`、`@output`、`@@headers`、`@@query`、`@@body`、`@@params`、`@@code`，三级或以上不做限制

只有 `@action` 是必须的，如果没有则不会生成文档。其他都可选

#### @action

作为自动化文档注释的标识，其后所带内容为该 `Action` 名称，新起一行的内容则为该 `Action` 介绍

#### `@input`/`@output`

输入/输出的参数

`@input` 可选 `@@headers`、`@@query`、`@@body`、`@@params`

`@output` 可选 `@@headers`、`@@body`、`@@code`

1. `@@headers`: 头部参数

2. `@@params`: 查询参数

3. `@@query`: RESTFul 地址参数

4. `@@body`: 内容参数

`@@body` 与 `@@headers`、`@@query`、`@@params` 有些不同，其右侧内容可选，内容是对 body 做介绍的文档

5. `@@code`: 返回状态码

#### 参数

参数格式统一为 `@*prop-name {type} desc`，`@`的数量表示深度，可无限递归

#### parts

parts 的内容较为复杂，参考 [parts](###parts) 部分

### `docs` 属性赋值

参考如下内容给`Action`实例对象的 `docs` 属性赋值：

```TS
    this.docs = {
      name: "get docs",
      desc: "a docs test named get",
      input: {
        headers: [
          {
            name: "test-header1",
            desc: "a test header of getting docs NO.1",
            type: "string",
          },
          {
            name: "test-header2",
            type: "number",
          },
          {
            name: "test-header3",
            desc: "a test header of getting docs NO.3",
            type: "object",
            children: [
              {
                name: "test-header31",
                desc: "a test header of getting docs NO.3.1",
                type: "string",
              },
              {
                name: "test-header32",
                desc: "a test header of getting docs NO.3.1",
                type: "number",
              },
            ],
          },
          {
            name: "test-header4",
            desc: "a test header of getting docs NO.4",
            type: "number",
          },
        ],
        body: {
          type: "string",
          desc: "http method",
        },
      },
      output: {
        codes: [
          {
            code: 200,
            desc: "success",
          },
          {
            code: 404,
          },
        ],
        body: [
          {
            name: "method",
            type: "string",
            desc: "http method",
          },
        ],
      },
      parts: ["test1", "test2", "custom"],
    };
```

其实 [action 注释](###action注释) 的方式最终会编译为 `ApiDocs` 对象，如果编写内容相同，则二者最终生成的文档也相同。

因此各属性的介绍与 [action 注释](###action注释) 的方式相同，此处不再赘述。

### 配置文件

前面所说 `cba-doc` 命令的第三个参数为配置文件路径，配置文件格式如下：

```JSON
{
  "title": "cba-title",
  "subtitle": "cba-subtitle",
  "parts": [
    "docs/configs/test1.json",
    "docs/configs/test2.json",
    "docs/configs/test3.json"
  ],
  "partsFromAuth": true
}
```

1. title: 生成文档的标题
2. subtitle: 生成文档的简介
3. parts: 参考 [parts](###parts) 部分
4. partsFromAuth: 参考 [parts](###parts) 部分

### parts

有些参数可能会被多个 API 使用，对于一个网站，可能大多数 API 都需要在头部传入`cookie`、`account`等。

利用 `parts` 功能可以重复使用某些参数。

#### 配置

前面配置文件的 `parts` 属性值为字符串数组，内容为重复部分的配置文件路径，每个文件都是一个可配置项。

每个可配置项格式如下：

```JSON
{
  "name": "custom",
  "query": [
    {
      "name": "base-query",
      "desc": "this is a base query",
      "type": "string"
    }
  ],
  "outputHeaders":[],
  "inputHeaders":[],
  "params":[],
  "codes":[]
}

```

其中 `name` 值为该配置项的标识。如果该值为空或未设置，则会使用该配置项的文件名。

#### ApiDocs 对象

对于 `ApiDocs`，其属性 parts 值为字符串数组，字符串是配置项的标识。

如果 `ApiDocs.parts` 包含某个可配置项，则生成的文档会包含该可配置项的内容。

优势 `parts` 与 `auth` 使用场景可能重复。为了简单化，属性 parts 值也可以为一个特殊值 `@auth`，此时这个 `Action` 的 `parts`属性值将取自 `auth` 属性值。

更进一步，如果配置文件中的 `partsFromAuth` 属性值为 `true`，那么所有 `parts` 如果未设置值，都将取自 `auth` 属性值。（未写自动化文档 `Action `将被忽略，没有 `@input` 将忽略输入参数，没有 `@output` 将忽略输出参数 ）。

#### 注释中的格式

在注释中，格式如：

```
@parts part1 part2
```

或取自 `auth` 属性值：

```
@parts @auth
```
