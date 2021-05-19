import { Action } from "../../../src";

export default class extends Action {
  constructor() {
    super(["admin"]);
  }

  async do(): Promise<void> {
    const { account, password } = this.requestParams.headers;

    this.ok({
      msg: "admin auth",
      account,
      password,
    });
  }
}
