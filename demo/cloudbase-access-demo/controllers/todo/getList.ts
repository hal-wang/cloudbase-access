import { Action, HttpResult } from "@hal-wang/cloudbase-access";

/**login 权限验证 */
export default class extends Action {
  constructor() {
    super(["login"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.headers;

    return this.ok([
      {
        id: "1",
        content: "todo 1",
      },
      {
        id: "2",
        content: "todo 2",
      },
      {
        id: "3",
        content: "todo 3",
      },
      {
        id: "4",
        content: "todo account: " + account,
      },
    ]);
  }
}
