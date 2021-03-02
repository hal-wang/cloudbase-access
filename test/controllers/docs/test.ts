import { Action, HttpResult } from "../../../src";

export default class extends Action {
  constructor() {
    super([]);
  }

  async do(): Promise<HttpResult> {
    return this.ok({
      method: "GET",
    });
  }
}
