import { Action } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async invoke(): Promise<void> {
    this.ok({
      method: "GET",
    });
  }
}
