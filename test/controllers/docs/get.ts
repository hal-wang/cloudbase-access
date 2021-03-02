import { Action, HttpResult } from "../../../src";

/**
 * a docs test named get
 *
 * @action get docs
 * @input
 * @@headers
 * @@@test-header1 {string} a test header of getting docs NO.1
 * @@@test-header2 {number}
 * @@@test-header3 {object} a test header of getting docs NO.3
 * @@@@test-header31 {string} a test header of getting docs NO.3.1
 * @@@@test-header32 {number} a test header of getting docs NO.3.2
 * @@@test-header4 {number} a test header of getting docs NO.4
 * @output
 * @@codes
 * @@@200 success
 * @@@404
 * @@body
 * @@@method {string} http method
 */
export default class extends Action {
  constructor() {
    super([]);

    this.docs = {
      name: "get docs",
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
        codes: [
          {
            code: 200,
            desc: "success",
          },
          {
            code: 404,
          },
        ],
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