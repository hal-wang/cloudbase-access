import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";
import Global from "../../../lib/Global";

export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.query;
    if (account == Global.testId) {
      return this.badRequestMsg({ message: "can't delete the test user" });
    }

    await Collections.todo
      .where({
        uid: account,
      })
      .remove();
    await Collections.user.doc(account).remove();

    return this.noContent();
  }
}
