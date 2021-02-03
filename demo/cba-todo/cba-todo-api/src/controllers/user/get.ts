import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../lib/Collections";

export default class extends Action {
  constructor() {
    super(["admin"]);
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