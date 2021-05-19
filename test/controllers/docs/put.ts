import { Action } from "../../../src";

/**
 * @action put docs
 *
 * a docs test named put
 *
 * @input
 */
export default class extends Action {
  constructor() {
    super(["test1", "custom"]);
  }

  async do(): Promise<void> {
    this.ok({
      method: "PUT",
    });
  }
}
