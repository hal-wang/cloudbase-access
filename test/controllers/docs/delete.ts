import { Action, HttpResult } from "../../../src";

/**
 * @action delete docs
 *
 * a docs test named delete
 *
 * @input
 * @@headers
 * @@@test-header1 {string} a test header of deleting docs NO.1
 * @@@test-header2 {number}
 * @@@test-header3 {object} a test header of deleting docs NO.3
 * @@@@test-header31 {string} a test header of deleting docs NO.3.1
 * @@@@test-header32 {number} a test header of deleting docs NO.3.2
 * @@@test-header4 a test header of deleting docs NO.4
 * @@@test-header5 {number} a test header of deleting docs NO.5
 * @@body method {string} http method
 * @output
 * @@codes
 * @@@200 success
 * @@@404
 * @@body
 * @@@method {string} http method
 */
export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.ok({
      method: "DELETE",
    });
  }
}
