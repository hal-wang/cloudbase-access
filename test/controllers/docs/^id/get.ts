import { Action, HttpResult } from "../../../../src";

/**
 * @action get doc
 *
 * get a doc
 *
 * @parts test1 test2 custom
 * @input
 * @output
 */
export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.ok({
      method: "GET",
    });
  }
}
