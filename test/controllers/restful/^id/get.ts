import { Action } from "../../../../src";

export default class extends Action {
  async do(): Promise<void> {
    this.ok({
      method: "GET",
      id: this.requestParams.query.id,
    });
  }
}
