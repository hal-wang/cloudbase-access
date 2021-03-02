import { Action, HttpResult } from "../../../src";

export default class extends Action {
  constructor() {
    super([]);

    this.docs = {};
  }

  async do(): Promise<HttpResult> {
    return this.ok({
      method: "POST",
    });
  }
}
