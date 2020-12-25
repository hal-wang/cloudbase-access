import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  constructor() {
    super(["admin"]);
  }

  async do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.headers;

    return this.ok({
      msg: "admin auth",
      account,
      password,
    });
  }
}
