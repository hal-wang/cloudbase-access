import { Action } from "../../../src";

export default class extends Action {
  constructor() {
    super(["login"]);
  }

  async invoke(): Promise<void> {
    const { account, password } = this.httpContext.request.headers;

    this.ok({
      msg: "login auth",
      account,
      password,
    });
  }
}
