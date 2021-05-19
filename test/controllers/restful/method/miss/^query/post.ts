import { Action } from "../../../../../../src";

export default class extends Action {
  async do(): Promise<void> {
    this.ok({
      method: "POST",
      action: "miss/query",
      realPath: this.realPath,
    });
  }
}
