import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";

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
