import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  constructor() {
    super(["login"]);
  }

  async do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.headers;

    return this.ok({
      msg: "login auth",
      account,
      password,
    });
  }
}
