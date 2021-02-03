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

    if (this.roles.includes("qa") || this.roles.includes("admin")) {
      if (!(await this.queryAccountAuth())) {
        return MiddlewareResult.getFailedResult(
          HttpResult.forbiddenMsg({ message: "error account or password" })
        );
      }
    }

    if (this.roles.includes("admin") && !this.adminAuth()) {
      return MiddlewareResult.getFailedResult(
        HttpResult.forbiddenMsg({ message: "not admin" })
      );
    }

    if (this.roles.includes("todo") && !(await this.todoIdAuth())) {
      return MiddlewareResult.getFailedResult(
        HttpResult.notFoundMsg({ message: "the todo item is not existing" })
      );
    }

    return MiddlewareResult.getSuccessResult();
  }

  adminAuth(): boolean {
    const { id } = this.requestParams.headers;
    return id == Global.adminId;
  }

  async queryAccountAuth(): Promise<boolean> {
    const { account } = this.requestParams.query;
    const { password } = this.requestParams.headers;
    const countRes = await Collections.user
      .where({
        _id: account,
        password,
      })
      .count();
    return countRes.total > 0;
  }

  async todoIdAuth(): Promise<boolean> {
    const { todoId, account } = this.requestParams.query;
    const countRes = await Collections.todo
      .where({
        _id: todoId,
        uid: account,
      })
      .count();
    return countRes.total > 0;
  }
}
