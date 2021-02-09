import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";

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
