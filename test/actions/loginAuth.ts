import { Action, HttpResult } from "../../src";

export default class Login extends Action {
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
