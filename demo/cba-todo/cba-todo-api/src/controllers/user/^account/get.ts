import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";

export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.query;
    if (typeof account != "string") {
      return this.badRequestMsg();
    }

    const accRes = await Collections.user.doc(account).get();
    const result = this.ok(accRes.data[0]);
    result.headers.realPath = this.realPath || "";
    return result;
  }
}
