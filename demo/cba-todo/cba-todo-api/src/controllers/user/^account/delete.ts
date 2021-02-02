import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";

export default class extends Action {
  constructor() {
    super(["login"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.query;
    await Collections.todo
      .where({
        uid: account,
      })
      .remove();
    await Collections.user.doc(account).remove();

    return this.noContent();
  }
}
