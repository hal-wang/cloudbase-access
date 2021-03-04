import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";

/**
 * @action user info
 *
 * get a user info
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @@@400 account format error
 * @@body {object} user info
 * @@headers
 * @@@realPath {string} the action's real path
 */
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
