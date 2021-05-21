import { Action } from "../../../../src";

export default class extends Action {
  async invoke(): Promise<void> {
    this.ok({
      method: "DELETE",
      id: this.ctx.request.query.id,
    });
  }
}
