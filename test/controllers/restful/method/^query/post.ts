import { Action, HttpResult } from "../../../../../src";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.ok({
      method: "POST",
      action: "query",
      realPath: this.realPath,
    });
  }
}
