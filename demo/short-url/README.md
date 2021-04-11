# short-url

能够使用自己的域名，简化 url

如 <https://s.hal.wang/zhihu> -> `https://zhuanlan.zhihu.com/p/91947139`

## 你需要做的

### 一键部署

[![](https://main.qcloudimg.com/raw/95b6b680ef97026ae10809dbd6516117.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Fcloudbase-access&workDir=demo%2Fshort-url&branch=main)

### 配置 HTTP 访问服务

1. 添加触发路径 `/w`，关联资源为静态托管，以开启网站功能，如 `s.hal.wang/w`
2. 添加自定义域名，如 `s.hal.wang`

## 注意事项

1. API 生成短链接中的域名，是根据调用 API 时头部的 `short-url-origin`。因此调用 API 需要注意头部参数。
2. 跳转使用 302，因为可能存在限制访问次数的短链接。如果使用 301 则无法正确统计。
3. 随机部分，默认是 4 位，如果 4 位的冲突较多，则生成 5 位。以此类推，长度不限。
