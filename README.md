用于快速创建支持 HTTP 访问服务的 CloudBase 云函数

## 安装

npm i @hbrwang/cloudbase-access --save

## Router

帮助你快速构建 MVC 架构的 WebAPI。

### 入口

构造函数传入环境 `event`，然后执行 `do` 函数。如在 `main` 函数中：

```JS
const Router = require('@hbrwang/cloudbase-access').Router
exports.main = async event => {
  const router = new Router(event)
  return await router.do()
}
```

以上几行代码即创建一个简单的 MVC 架构的 API。

如果访问的路径不存在，会返回 404 NotFound 结构。

### 请求参数

在 Router 中，解析了请求参数，放在`router.requestParams`字段，结构如下：

```JS
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

```JS
const Router = require('@hbrwang/cloudbase-access').Router

const auth = async function () {
  // 以下操作中，this 均为 router 对象
  const { event, headers, path, params, data } = this.requestParams // 可在auth函数中获取请求参数

  const auth = this.module.auth // auth是按特定规则定义，后面创建部分会说明
  if (!auth || auth.length == 0) return true

  if(/* 验证通过 */) return true
  else return false
}

exports.main = async event => {
  const router = new Router(event, auth)
  return await router.do()
}

```

### Action 创建规则

#### 新建文件

- 创建完入口后，在云函数根目录（即与 index.js 同级）创建名为`controllers`文件夹。 **重要：`controllers`名称不能错，否则检索不到**
- 根据各业务，创建不同 controller 文件夹，名称自定，但名称与路由名称相同。
- 在 controller 文件夹中，创建`.js`文件，每个`.js`文件对应一个`action`

比如你需要一个用户登录的 API，那么路径应如下（user 和 login 名称自定）：

```
/controllers/user/login.js
```

#### Action 文件内容

在`.js`文件中，模块返回一个对象，该对象有两个字段

1. auth：权限控制，可选
2. action：API 函数内容

auth 是个角色数组。如`['login']`，可在前面`auth`函数中判断为需要登陆。如果`['login','admin']`，可在前面`auth`函数中判断为需要登录而且身份是管理员。
如果不定义 auth，默认 任何人都可以访问到 action。当然，也可以在 action 中单独定义规则，但代码复用度不高。

例 1

```JS
const { ok, notFound } = require('@hbrwang/cloudbase-access').Results // 返回结构，后续 Results 部分会介绍

module.exports = {
  action: async function ({ data }) {
    const { account, password } = data

    if(/*账号或密码错误*/) return notFound('账号或密码错误')

    return ok(new {/*返回信息*/})
  }
}
```

例 2

```JS
const { ok } = require('@hbrwang/cloudbase-access').Results

module.exports = {
  auth: ['login']
  action: async function ({ headers }) {
    const uid = headers.uid // 在auth中已经验证 uid 的正确性
    const todoList = [] // 可放心从数据库读取用户数据，因为uid已验证
    return ok(todoList)
  }
}
```

## Results

`cloudbase-access`定义了一些 HTTP 返回结构，都以函数方式调用。

### 支持类型

目前除`base`外，支持以下类型：

- accepted, 202
- badRequest, 400
- errRequest, 500
- forbidden, 403
- noContent, 204
- notFound, 404
- ok, 200
- partialContent, 206

当然也可以使用`base`，自定义返回状态码。

### 参数

除`base`外，都支持传入两个可选参数：

1. `body`: 返回的 body 内容
2. `headers`: 返回的额外头部内容，默认包含以下头部：

```JS
{
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}
```

`base`多了个参数`statusCode`，可指定返回状态码，其余状态码都是固定的。

### 举例

以下例子中返回 200 请求成功：

```JS
const { ok } = require('@hbrwang/cloudbase-access').Results

return ok({
  list:[],
  count:0
})
```

以下例子中返回 400 请求错误：

```JS
const { badRequest } = require('@hbrwang/cloudbase-access').Results

return badRequest('请求错误')
```
