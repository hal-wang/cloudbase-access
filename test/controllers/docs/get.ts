import { Action, ApiDocsParam, HttpResult } from "../../../src";

export default class extends Action {
  constructor() {
    super([]);

    this.docs = {
      input: {
        headers: <ApiDocsParam[]>[
          {
            name: "a-header",
            desc: "a test header",
            type: "string",
          },
        ],
      },
    };
  }

  async do(): Promise<HttpResult> {
    return this.ok({
      method: "GET",
    });
  }
}
