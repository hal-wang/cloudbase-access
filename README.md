用于快速创建支持 HTTP 访问服务的 CloudBase 云函数

## 安装

npm i @hbrwang/cloudbase-access

## Router

帮助你快速构建 MVC 架构的 WebAPI。

### 入口

构造函数传入环境 `event`，然后执行 `do` 函数。如在 `main` 函数中：

```ts
import { Router } from "@hbrwang/cloudbase-access";
export const main = async (event: any) => {
  const router = new Router(event);
  return await router.do();
};
```

以上几行代码即创建一个简单的 MVC 架构的 API。

如果访问的路径不存在，会返回 404 NotFound 结构。

### 请求参数

在 Router 中，解析了请求参数，放在`router.requestParams`字段，结构如下：

```ts
get requestParams() {
  return {
    event: this.event,
    headers: this.headers,
    path: this.path,
    params: this.params,
    data: this.data,
  };
}
```

- event: 云函数环境 event
- headers: 请求头部
- path: 访问路径，如`POST https://api.com/user/login`，path 值为`/user/login`
- params: 查询参数
- data: 请求 body 数据，已转 JSON

### 权限

`Router`构造函数第二个参数是权限验证的函数

权限是用于判断用户能否使用 API，用法如下：

```ts
import { Router } from "@hbrwang/cloudbase-access";

const auth = async function () {
  // 以下操作中，this 均为 router 对象
  const { event, headers, path, params, data } = this.requestParams // 可在auth函数中获取请求参数

  const auth = this.module.auth // auth是按特定规则定义，后面创建部分会说明
  if (!auth || auth.length == 0) return true

  if(/* 验证通过 */) return true
  else return false
}

export const main = async (event: any) => {
  const router = new Router(event, auth);
  return await router.do();
};
```

### Action 创建规则

#### 新建文件

- 创建完入口后，在云函数根目录（即与 index.ts 同级）创建名为`controllers`文件夹。 **重要：`controllers`名称不能错，否则检索不到**
- 根据各业务，创建不同 controller 文件夹，名称自定，但名称与路由名称相同。
- 在 controller 文件夹中，创建`.ts`文件，每个`.ts`文件对应一个`action`
- 在`.ts`文件中创建类，并继承 `BaseAction`，重写 `do` 函数

```ts
import { BaseAction, HttpResult } from "@hbrwang/cloudbase-access";

export default class Login extends BaseAction {
  constructor(requestParams: Object) {
    super(requestParams);
  }

  do(): Promise<HttpResult> {
    return this.noContent();
  }
}
```

比如你需要一个用户登录的 API，那么路径应如下（user 和 login 名称自定）：

```
/controllers/user/login.ts
```

#### Action 文件内容

在`.ts`文件中，模块返回一个类，该类继承 `BaseAction`，构造函数有一个参数

1. API 请求参数 `requestParams`
2. 权限管理参数`auth`

auth 是个角色数组。如`['login']`，可在前面`auth`函数中判断为需要登陆。如果`['login','admin']`，可在前面`auth`函数中判断为需要登录而且身份是管理员。
如果不定义 auth，默认任何人都可以访问到 action。当然，也可以在 action 中单独定义规则，但代码复用度不高。

例 1

```ts
import { BaseAction, HttpResult } from "@hbrwang/cloudbase-access";

export default class Login extends BaseAction {
  constructor(requestParams: Object) {
    super(requestParams);
  }

  do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.data

    if(/*账号或密码错误*/) return this.notFound('账号或密码错误')
    return this.ok(new {/*返回信息*/})
  }
}
```

例 2

```ts
import { BaseAction, HttpResult } from "@hbrwang/cloudbase-access";

export default class GetToDoList extends BaseAction {
  constructor(requestParams: Object) {
    super(requestParams);
  }

  do(): Promise<HttpResult> {
    const { headers } = this.requestParams;
    const uid = headers.uid; // 在auth中已经验证 uid 的正确性
    const todoList = []; // 可放心从数据库读取用户数据，因为uid已验证
    return this.ok(todoList);
  }
}
```

## HttpResult

`cloudbase-access`定义了一些 HTTP 返回结构，都以函数方式调用。

### 内置类型

目前除`HttpResult`构造函数外，内置以下类型：

- accepted, 202
- badRequest, 400
- errRequest, 500
- forbidden, 403
- noContent, 204
- notFound, 404
- ok, 200
- partialContent, 206

当然也可以使用`HttpResult`对象，自定义返回状态码。

### 内置类型参数

内置类型都支持传入`body`可选参数，返回的 body 内容。

### 举例

以下例子中返回 200 请求成功：

```ts
import { HttpResult } from "@hbrwang/cloudbase-access";

return HttpResult.ok({
  list: [],
  count: 0,
});
```

以下例子中返回 400 请求错误：

```ts
import { HttpResult } from "@hbrwang/cloudbase-access";
return HttpResult.badRequest("请求错误");
```

### 在 BaseAction 中

在 `BaseAction` 中已经加入了 HttpResult 函数，可以直接 `this.func` 方式调用

```ts
export default class Login extends BaseAction {
  constructor(requestParams: Object) {
    super(requestParams);
  }

  do(): Promise<HttpResult> {
    return this.noContent();
  }
}
```
