import { Action, HttpResult } from "../../../src";

export default class extends Action {
  constructor() {
    super([]);

    this.docs = {
      desc: "a docs test named get",
      input: {
        headers: [
          {
            name: "test-header1",
            desc: "a test header of getting docs NO.1",
            type: "string",
          },
          {
            name: "test-header2",
            type: "number",
          },
          {
            name: "test-header3",
            desc: "a test header of getting docs NO.3",
            type: "object",
            children: [
              {
                name: "test-header31",
                desc: "a test header of getting docs NO.3.1",
                type: "string",
              },
              {
                name: "test-header32",
                desc: "a test header of getting docs NO.3.1",
                type: "number",
              },
            ],
          },
          {
            name: "test-header4",
            desc: "a test header of getting docs NO.4",
            type: "number",
          },
        ],
      },
      output: {
        code: 200,
        body: [
          {
            name: "method",
            type: "string",
            desc: "http method",
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
