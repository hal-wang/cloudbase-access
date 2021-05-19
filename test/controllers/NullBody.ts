import { Action } from "../../src";

export default class extends Action {
  async invoke(): Promise<void> {
    const test = this.httpContext.request.data.test as string;
    this.ok({
      test,
    });
  }
}
