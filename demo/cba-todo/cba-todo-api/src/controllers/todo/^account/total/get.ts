import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";

/**
 * @action user todo count
 *
 * get the count of user's all todos
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @body
 * @@total {number} the count of user's all todos
 */
export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.query;

    const countRes = await Collections.todo
      .where({
        uid: account,
      })
      .count();

    return this.ok({
      total: countRes.total,
    });
  }
}
