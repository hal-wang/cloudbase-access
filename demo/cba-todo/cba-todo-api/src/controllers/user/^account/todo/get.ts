import { Action, DbHelper, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";

export default class extends Action {
  constructor() {
    super(["qa"]);
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
