import { Action } from "../../src";

export default class extends Action {
  async do(): Promise<void> {
    const test = this.requestParams.data.test as string;
    this.ok({
      test,
    });
  }
}
