import { Action, HttpResult } from "@hbrwang/cloudbase-access";
import global from "../../lib/Global";
import linq = require("linq");

export default class extends Action {
  async do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.data;

    if (
      linq
        .from(global.users)
        .where((u) => u.account == account && u.password == password)
        .count() == 0
    ) {
      return this.notFound("账号或密码错误");
    }

    return this.ok({
      account,
      more: "... more info ...",
    });
  }
}
