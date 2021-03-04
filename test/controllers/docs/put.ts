import { Action, HttpResult } from "../../../src";

/**
 * @action put docs
 *
 * a docs test named put
 *
 * @parts @auth
 * @input
 */
export default class extends Action {
  constructor() {
    super(["test1", "custom"]);
  }

  async do(): Promise<HttpResult> {
    return this.ok({
      method: "PUT",
    });
  }
}
