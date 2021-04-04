import {
  HttpResult,
  Authority,
  MiddlewareResult,
} from "@hal-wang/cloudbase-access";
import Collections from "./Collections";
import Global from "./Global";

export default class Auth extends Authority {
  async do(): Promise<MiddlewareResult> {
    if (!this.roles || !this.roles.length) {
      return MiddlewareResult.getSuccessResult();
    }

    if (this.roles.includes("ql")) {
      if (this.roles.includes("admin") && !this.queryAdminAuth()) {
        return MiddlewareResult.getFailedResult(
          HttpResult.forbiddenMsg({ message: "not admin" })
        );
      }

      if (!(await this.queryLoginAuth())) {
        return MiddlewareResult.getFailedResult(
          HttpResult.forbiddenMsg({ message: "error account or password" })
        );
      }
    }

    if (this.roles.includes("hl")) {
      if (this.roles.includes("admin") && !this.headerAdminAuth()) {
        return MiddlewareResult.getFailedResult(
          HttpResult.forbiddenMsg({ message: "not admin" })
        );
      }

      if (!(await this.headerLoginAuth())) {
        return MiddlewareResult.getFailedResult(
          HttpResult.forbiddenMsg({ message: "error account or password" })
        );
      }
    }

    if (this.roles.includes("todo") && !(await this.todoIdAuth())) {
      return MiddlewareResult.getFailedResult(
        HttpResult.notFoundMsg({ message: "the todo item is not existing" })
      );
    }

    return MiddlewareResult.getSuccessResult();
  }

  private queryAdminAuth(): boolean {
    const { account } = this.requestParams.query;
    return account == Global.adminId;
  }

  private headerAdminAuth(): boolean {
    const { account } = this.requestParams.headers;
    return account == Global.adminId;
  }

  private async headerLoginAuth(): Promise<boolean> {
    const { account, password } = this.requestParams.headers;
    if (!account || !password) return false;
    return await this.loginAuth(account, password);
  }

  private async queryLoginAuth(): Promise<boolean> {
    const { account } = this.requestParams.query;
    const { password } = this.requestParams.headers;
    if (!account || !password) return false;
    return await this.loginAuth(account, password);
  }

  private async loginAuth(account: string, password: string): Promise<boolean> {
    const countRes = await Collections.user
      .where({
        _id: account,
        password,
      })
      .count();
    return !!countRes.total;
  }

  private async todoIdAuth(): Promise<boolean> {
    const { todoId, account } = this.requestParams.query;
    const countRes = await Collections.todo
      .where({
        _id: todoId,
        uid: account,
      })
      .count();
    return !!countRes.total;
  }
}
