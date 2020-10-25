用于快速创建 CloudBase 支持 HTTP 访问服务的云函数

## 快速开始

npm i @hbrwang/cloudbase-access --save

## Results

HTTP 返回结构，目前有以下结构：

- accepted, 202
- badRequest, 400
- errRequest, 500
- forbidden, 403
- noContent, 204
- notFound, 404
- ok, 200
- partialContent, 206

当然也可以使用`base`，自定义返回状态码

示例：

```JS
const Result=require('')

return ok({
  list:[],
  count:0
})
```

```JS
const modules = [
  "accepted",
  "badRequest",
  "base",
  "errRequest",
  "forbidden",
  "noContent",
  "notFound",
  "ok",
  "partialContent",
];
```
