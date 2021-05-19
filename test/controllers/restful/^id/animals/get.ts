import { Action } from "../../../../../src";

export default class extends Action {
  async invoke(): Promise<void> {
    this.ok({
      method: "GET",
      id: this.httpContext.request.query.id,
    });
  }
}
