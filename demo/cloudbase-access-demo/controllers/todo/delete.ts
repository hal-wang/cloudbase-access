import { Action, HttpResult } from "@hbrwang/cloudbase-access";

/**admin 权限验证 */
export default class extends Action {
  constructor() {
    super(["admin"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.headers;

    return this.ok({
      account,
      msg: "admin",
    });
  }
}
