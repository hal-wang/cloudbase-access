import { Action, HttpResult } from "../..";

export default class Login extends Action {
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
