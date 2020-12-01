import { HttpResult, Authority } from "@hbrwang/cloudbase-access";
import linq = require("linq");
import global from "./Global";

export default class Auth extends Authority {
  async do(): Promise<HttpResult | null> {
    if (!this.roles || !this.roles.length) return null;

    if (
      (this.roles.includes("login") || this.roles.includes("admin")) &&
      !this.loginAuth()
    ) {
      return HttpResult.forbidden("账号或密码错误") as any;
    }

    if (this.roles.includes("admin") && !this.adminAuth()) {
      return HttpResult.forbidden("不是管理员") as any;
    }

    return null;
  }

  adminAuth() {
    const { account } = this.requestParams.headers;
    return account == global.adminAccount;
  }

  loginAuth() {
    const { account, password } = this.requestParams.headers;
    return (
      linq
        .from(global.users)
        .where((u: any) => u.account == account && u.password == password)
        .count() > 0
    );
  }
}
