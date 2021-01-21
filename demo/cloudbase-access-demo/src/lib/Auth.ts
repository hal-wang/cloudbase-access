import {
  HttpResult,
  Authority,
  MiddlewareResult,
} from "@hal-wang/cloudbase-access";
import linq = require("linq");
import global from "./Global";

export default class Auth extends Authority {
  async do(): Promise<MiddlewareResult> {
    if (!this.roles || !this.roles.length) {
      return MiddlewareResult.getSuccessResult();
    }

    if (
      (this.roles.includes("login") || this.roles.includes("admin")) &&
      !this.loginAuth()
    ) {
      return MiddlewareResult.getFailedResult(
        HttpResult.forbiddenMsg({ message: "账号或密码错误" })
      );
    }

    if (this.roles.includes("admin") && !this.adminAuth()) {
      return MiddlewareResult.getFailedResult(
        HttpResult.forbiddenMsg({ message: "不是管理员" })
      );
    }

    return MiddlewareResult.getSuccessResult();
  }

  adminAuth(): boolean {
    const { account } = this.requestParams.headers;
    return account == global.adminAccount;
  }

  loginAuth(): boolean {
    const { account, password } = this.requestParams.headers;
    return (
      linq
        .from(global.users)
        .where(
          (u: Record<string, unknown>) =>
            u.account == account && u.password == password
        )
        .count() > 0
    );
  }
}
