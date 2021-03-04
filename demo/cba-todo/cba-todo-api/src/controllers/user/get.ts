import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../lib/Collections";

/**
 * @action get users
 *
 * get all users' info
 *
 * @part hl
 * @output
 * @@codes
 * @@@200 success
 * @@body {array} user list
 */
export default class extends Action {
  constructor() {
    super(["hl", "admin"]);
  }

  async do(): Promise<HttpResult> {
    const accsRes = await Collections.user
      .field({
        password: false,
      })
      .get();

    return this.ok(accsRes.data);
  }
}
