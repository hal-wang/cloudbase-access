import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.ok({
      name: "cloudbase-access",
    });
  }
}
