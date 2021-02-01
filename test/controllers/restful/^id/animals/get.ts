import { Action, HttpResult } from "../../../../../src";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.ok({
      method: "GET",
      id: this.query.id,
    });
  }
}
