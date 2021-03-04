import { Action, DbHelper, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";

/**
 * @action todos
 *
 * get todo list
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @body {array} todo list
 */
export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.query;

    const result = await DbHelper.getPageList(
      this.requestParams,
      Collections.todo
        .where({
          uid: account,
        })
        .orderBy("update_at", "desc")
        .orderBy("create_at", "desc")
    );
    return this.ok(result);
  }
}
