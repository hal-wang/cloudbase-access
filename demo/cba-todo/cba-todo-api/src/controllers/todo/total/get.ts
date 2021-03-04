import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";

/**
 * @action todo count
 *
 * get the count of all todos
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @body
 * @@total {number} the count of all todos
 */
export default class extends Action {
  constructor() {
    super(["hl", "admin"]);
  }

  async do(): Promise<HttpResult> {
    const countRes = await Collections.todo.count();
    return this.ok({
      total: countRes.total,
    });
  }
}
