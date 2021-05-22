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

强烈建议使用 `typescript` ，通过对 cba 的配置可以生成云函数可以调用的 js 文件。

理论上 `javascript` 完全没问题，但作者并未进行测试。

## Startup

`Startup` 是 `cba` 的控制中心，构造函数传入环境 `event` 和 `context`。

如在入口文件中编写（JS）：

```js
const { Startup } = require("@hal-wang/cloudbase-access");
exports.main = async (event, context) => {
  const startup = new Startup(event, context);
  startup.use(async (ctx) => {
    ctx.res.body = "hello world";
  });
  return await startup.invoke();
};
```

以上几行代码即创建一个简单的 API

## 构建

在 package.json 文件的 scripts 节点下添加

```JSON
"build": "cba-build"
```

```JSON
{
  "scripts": {
    "build": "cba-build"
  },
  "dependencies": {
    "@hal-wang/cloudbase-access": "^2.0.1"
  }
}
```

构建时运行

```
npm run build
```

## 配置文件

在项目目录下定义 `cba.config.json` 文件，一个常规配置文件如下：

```JSON
{
  "router": {  // 路由相关
    "dir": "controllers", // 路由文件夹目录
    "strict": false // 是否严格控制 httpMethod
  },
  "ts": { // ts编写代码的配置
    "static": [ // 静态文件/文件夹。由于ts的生成目录一般在其他位置，如果有生产环境需要的非 .ts 文件，需要在此声明
      {
        "source": "static", // 原文件/文件夹相对路径
        "target": "assets" // 目标文件/文件夹相对路径
      },
      {
        "source": "static.txt",
        "target": "read.txt"
      }
    ]
  },
  "doc": { // 使用 cba-map 命令生成文档时必须，详情参考后面的 “自动化文档”
    "output": "../docs/api/README.md",
    "title": "cba-title",
    "subtitle": "cba-subtitle",
    "parts": [
      {
        "inputHeaders": [
          {
            "name": "base-input-header",
            "desc": "this is a base input header",
            "type": "string"
          }
        ]
      },
      {
        "outputHeaders": [
          {
            "name": "base-output-header",
            "desc": "this is a base output header",
            "type": "string"
          }
        ]
      },
      {
        "name": "custom",
        "query": [
          {
            "name": "base-query",
            "desc": "this is a base query",
            "type": "string"
          }
        ]
      }
    ],
    "partsFromAuth": true
  }
}
```

## 路由（useRouter）

调用 `startup.useRouter` 函数即可开启路由中间件，开启后能够支持路由功能，常规项目都需要使用。

`useRouter` 接收一个可选配置参数 `config` ，该参数包含一个可选字段

- authFunc: 函数类型，函数返回值为权限认证对象，详情后面 [权限](#权限) 部分有介绍。

### 路由文件夹

配置文件的 `router.dir` 值是路由文件夹路径，`cba` 能够将路由文件夹下的所有 `Action` 映射为 `http` 访问路径

如果配置文件没有该值，默认为 `controllers`，并且在根目录下（ts 则是目标目录下）需要定义此文件夹

所有 API Action 统一放在这个文件夹中，在 `controllers` 目录中，建立各文件或文件夹。文件是 API 的最小执行单元 Action，详情后面 [##Action](##Action) 部分有介绍。

### 路由匹配

在`cba`中，路由与文件系统匹配。

路由查询参数命名以 `^` 开头（文件系统中命名不允许出现字符 `:`），如果存在多个查询参数则后面的会覆盖前面的，如 `get user/^id/todo/^id`，则 `id` 值为 `todoId`。正确命名应如 `user/^userId/todo/^todoId`。

如果限制 `httpMethod`, `action` 应以 `post.ts`、`get.ts`、`delete.ts`、`patch.ts`、`put.ts` （或其他自定义 method，扩展名为.js 效果相同 ）命名，否则任意 `httpMethod` 都可以访问。

#### X-HTTP-Method-Override

如果请求头部包含 `X-HTTP-Method-Override` 参数，则访问方法以 `X-HTTP-Method-Override` 值为准

比如 Action 要求 `PATCH` 请求，但微信小程序不支持 `PATCH`，那么可以使用 `POST` 访问，并在头部加上此参数，值为 `PATCH`

```JSON
"headers":{
  "X-HTTP-Method-Override":"PATCH"
}
```

### strict

配置文件的 `router.strict` 值决定是否开启严格模式

如果设置 `router.strict: true`, 则所有 `Action` 必须严格使用 `httpMethod` 命名，与 RESTFul 规范相符。否则会找不到路由并返回 `404`。

如果 `strict` 为 `false` 或不设置，则 RESTFul 规范的 API 可能会以非 RESTFul 方式调用。如路由 `user/login`，本应是 `get user/login`，但 `post user/login/get` 也能调用。因此如果使用 RESTFul 或限制 method，建议设置 `strict` 为 `true`。

#### 例 1

获取 todo list

##### 方式 1（推荐）

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

##### 方式 1（推荐）

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

因此建议设置 `strict` 为 true 。

## 中间件

中间件是 `cba` 最重要的部分之一，如记录日志，验证权限

以下内容都继承自中间件：

1. API 执行最小单元 `Action`
2. 权限认证 `Authority`
3. 其他派生自类 `Middleware`的中间件

所有中间件应派生自类 `Middleware`，并实现 `invoke` 函数

### 执行顺序

中间件是以递归方式严格按声明顺序执行，每个中间件都可以修改正向或反向管道内容

在中间件里如果需要调用下一个中间件，需执行 `await this.next()`，若不调用下一个中间件，中间件将反向递归执行，并最终返回当前管道内容

```
 中间件1   中间件2 ... 中间件n
    _       _           _
->-|-|-----|-|---------|-|-->   没有执行 next
   | |     | |         | |   ↓  或是最后一个
-<-|-|-----|-|---------|-|--<   反向递归
    -       -           -
```

### 注册中间件

你需要使用 `startup.use` 注册中间件，传参是一个创建中间件的回调函数，如（JS）

```js
const { Startup } = require("@hal-wang/cloudbase-access");
exports.main = async (event, context) => {
  const startup = new Startup(event, context);
  startup.use(async (ctx) => {
    // 简单中间件
    ctx.res.body = "hello world";
  });
  startup.use(() => new YourMiddleware()); // 类中间件
  return await startup.invoke();
};
```

#### 简单中间件

简单中间件不需要单独写一个中间件类，但其底层仍然会被转化为普通中间件来执行

```TS
startup.use(async (ctx) => {
  ctx.res.body = "hello world";
});
```

或

```TS
startup.use(async (ctx,next) => {
  ctx.res.body = "hello world";
  await next();
  ctx.res.headers.h = "h";
});
```

## 路由（`startup.useRouter()`）

`startup.useRouter` 是一个特殊的注册中间件的方式，调用该方法能够使 `cba` 支持路由功能

该方法可能会注册一个或两个中间件：

- 根据路由找到的 Action
- 权限验证 Authority（如果传参 auth）

## HttpContext

管道中的内容都在 `HttpContext` 对象之中，每个中间件都可以调用 `this.ctx` 来获取或修改管道内容

该对象包含以下属性：

- res: `Response` 对象，API 返回结果
- req: `Request` 对象，API 请求内容
- action: `Action` 对象，只有执行了 `Authority` 或 `Action` 的中间件后，此值才会有内容，因此可以在任意中间件中的 `await next()` 之后使用（如果没有执行 `Authority` 或 `Action` 中间件，`action` 值仍然为 `undefined`）

### Response

管道的返回内容，可以调用 `ctx.res.result` 来获取最终 HTTP 返回结构 `ResponseStruct`

在每个中间件中都可以修改 `this.ctx.res` 内容

### Request

`ctx.req` 对象已经解析并封装了请求参数

在中间件中，可通过 `this.ctx.req` 方式获取请求内容

`req` 对象包含以下字段

- event
- context
- path
- headers
- params
- data
- query

#### event

云函数环境 `event`

#### context

云函数环境 `context`

#### path

访问路径，如`POST https://domain.com/user/login`，path 值为`user/login`。

_注意：在 event 中，path 实为 `/` 开头，上例为 `/user/login`。但在 `cba` 中移除了开头的 `/`_

#### headers

请求头部

#### params

查询参数

#### data

请求 body，如果是 JSON 字符串，则自动转为 JSON 对象。

#### query

RESTFul 规范的路径中查询参数。如 `user/:id` 调用时是 `user/66`，在 query 中即存在

```ts
query.id == "66"; // true;
```

## Action

`Action` 也是中间件，该类继承于中间件类 `Middleware`， 正常情况 Action 会终止管道继续向后执行

每次调用 API，如果顺利进行，主要执行的是自定义 `Action` 对象中的 `invoke` 函数。

所有自定义 `Action` 都应派生自 `Action` 类，并重写 `invoke` 函数。

### 创建一个 Action

1. 在云函数根目录（即与 `index.ts` 同级）创建名为 `controllers` （也可以为其他路径或名称，但需要在配置文件设置，此处为默认 `controllers`）
1. 根据各业务，创建 `.ts/.js` 文件或文件夹，名称自定，但名称和路径会映射为访问路径，每个文件对应一个 `action`
1. 在 `.ts/.js` 文件中创建继承 `Action` 的类，并重写 `invoke` 函数

```
+-- controllers
|   +-- type1
|       +-- action1.ts
|       +-- action2.ts
|       +-- ...
|   +-- type2
|       +-- action3.ts
|       +-- action4.ts
|       +-- ^id
|           +-- action5.ts
|           +-- ...
```

### Action 文件内容

模块返回一个类，该类继承 `Action` 并实现 `invoke` 函数

```ts
import { Action } from "@hal-wang/cloudbase-access";
export default class extends Action {
  async invoke(): Promise<void> {}
}
```

#### 权限参数

构造函数有一个可选参数，传入字符串数组，值为允许的权限角色。

如判断调用需要登录信息：

```ts
["login"];
```

如判断调用者是管理员：

```ts
["admin"];
```

具体判断方式，参考后面的 [权限](#权限) 部分。

```ts
import { Action } from "@hal-wang/cloudbase-access";

export default class extends Action {
  constructor() {
    super(["login"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.headers; // 在auth中已经验证 account 的正确性，因此可认为调用者身份无误。

    const todoList = []; // 可放心从数据库读取用户数据，因为 account 已验证登录
    this.ok(todoList);
  }
}
```

### Action 内置结果

目前 `Action` 内置一些返回结果：

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
this.ok("success");
```

```ts
import { Action } from "@hal-wang/cloudbase-access";
export default class extends Action {
  async invoke(): Promise<void> {
    this.noContent();
    // or this.ok('success');
  }
}
```

```ts
import { Action } from "@hal-wang/cloudbase-access";
export default class extends Action {
  async invoke(): Promise<void> {
    const { account, password } = this.ctx.req.params

    if(/*账号或密码错误*/) {
      this.notFound('账号或密码错误')
    }
    else {
      this.ok({/*返回信息*/})
    }
  }
}
```

多数内置类型支持传入 `body` 可选参数，`body` 为返回的内容。
API 返回错误时，可统一返回 `ErrorMessage`，命名以 `Msg` 结尾的内置类型接受 `ErrorMessage` 参数。

## 权限

默认的权限功能是用于判断用户能否使用 API，可以精确到控制每个 `Action`

`startup.useRouter()` 参数接收一个 `authFunc` 字段，值为创建 `Authority` 派生类对象的回调

`Authority` 类继承于中间件类 `Middleware`，因此该类对象也是中间件，但加载方式比较特殊

因此你需要新写个类，继承 `Authority`，并实现 `invoke` 函数

当然你也可以自己写个权限管理中间件，效果可以与 `Authority` 相同，但可能无法在 `Action` 执行前访问 `Action` 中的 `roles` 字段

下例使用请求头部的账号信息验证调用者信息，用法如下：

```TS
// Authority 类，用于权限验证
class Auth extends Authority {
  async invoke(): Promise<void> {
    if (!this.roles || !this.roles.length) {
      await this.next(); // 无需验证，执行下一个中间件
      return;
    }

    if (this.roles.includes("login") && !this.loginAuth()) {
      this.forbidden("账号或密码错误"); // 终止中间件的执行
      return;
    }

    await this.next(); // 验证通过，执行下一个中间件
  }

  loginAuth() {
    // 实际情况应该需要查表等复杂操作
    const { account, password } = this.ctx.req.headers;
    return account == "abc" && password == "123456";
  }
}
```

```TS
// 云函数入口
export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  const startup = new Startup(event, context);
  startup.useRouter(
    authFunc: () => new Auth(),
  );
  return await startup.invoke();
};
```

```TS
// Action
import { Action } from "@hal-wang/cloudbase-access";
export default class extends Action {
  constructor() {
    super(["login"]);
  }

  // 只有 login 身份验证通过，才会执行此 invoke 函数
  async invoke(): Promise<void> {
    this.ok();
  }
}
```

## 自动化文档

`cba` 支持自动化文档创建，目前已支持输出 `md` 格式文档。

文档的编写支持两种方式：

1. 字段赋值：给 `Action` 类实例对象的 `docs` 属性赋值
2. 注释解析：按特定格式注释 `Action` 定义文件 （建议）

### 使用方式

使用此功能需要预先配置，后面 [自动化文档配置文件](###自动化文档配置文件) 部分有详细介绍。

在 package.json 文件中的 scripts 中添加

```json
  "scripts": {
    "doc": "cba-doc",
  },
```

执行 `npm run doc`

### `action` 注释

参考如下格式在文件任意处注释（建议在 Action 类声明之前）：

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

只有 `@action` 是必须的，如果没有则不会生成文档，其他都是可选的

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

`docs` 是 `ApiDocs` 对象

参考如下内容给 `Action` 实例对象的 `docs` 属性赋值：

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

### @auth

为了简单化，`action` 注释或 `docs` 属性赋值的方式，字段 `parts` 值也可以为一个特殊值 `@auth`，此时这个 `Action` 的 `parts` 字段值将取自 `action.roles` 字段值。

更进一步，如果配置文件中的 `partsFromAuth` 属性值为 `true`，那么所有 `parts` 如果未设置值，都将取自 `action.roles` 属性值。（没有 `@input` 将忽略输入参数，没有 `@output` 将忽略输出参数 ）。

### 自动化文档配置文件

在 `cba.config.json` 配置文件中，doc 字段即为自动化文档的相关配置，配置格式如下：

```JSON
{
  "doc": {
    "output": "../docs/api/README.md",
    "title": "cba-title",
    "subtitle": "cba-subtitle",
    "parts": [
      {
        "name": "part1",
        "inputHeaders": [
          {
            "name": "base-input-header",
            "desc": "this is a base input header",
            "type": "string"
          }
        ]
      },
      {
        "name": "part2",
        "outputHeaders": [
          {
            "name": "base-output-header",
            "desc": "this is a base output header",
            "type": "string"
          }
        ]
      },
      {
        "name": "part3",
        "query": [
          {
            "name": "base-query",
            "desc": "this is a base query",
            "type": "string"
          }
        ]
      }
    ],
    "partsFromAuth": true
  }
}
```

1. output
1. title
1. subtitle
1. parts
1. partsFromAuth

#### output

生成目标文件的相对路径

#### title

生成文档的标题

#### subtitle

生成文档的简介

#### parts

有些参数可能会被多个 API 使用，对于一个网站，可能大多数 API 都需要在头部传入`cookie`、`account`等。

利用 `parts` 功能可以重复使用某些参数。

每个 `part` 为一个`可配置项`

##### 配置

前面配置文件的 `parts` 属性值为`可配置项`数组。

每个`可配置项`格式如下：

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

其中 `name` 值为该配置项的标识，如果设置不正确会找不到该配置项

##### 注释中的格式

在注释中，parts 格式如：

```
@parts part1 part2
```

或取自 `auth` 属性值：

```
@parts @auth
```
