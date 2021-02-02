import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";

export default class extends Action {
  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.query;
    const { password } = this.requestParams.data;
    if (typeof account != "string" || typeof password != "string") {
      return this.badRequestMsg();
    }

    const accRes = await Collections.user
      .where({
        _id: account,
        password: password,
      })
      .get();
    if (accRes.data[0]) {
      return this.ok(accRes.data[0]);
    } else {
      return this.notFoundMsg({ message: "error account or password" });
    }
  }
}
