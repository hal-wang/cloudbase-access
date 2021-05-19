import { Action, ErrorMessage, HttpResult, HttpResultError } from "../../src";
import StatusCode from "../../src/HttpResult/StatusCode";

export default class extends Action {
  async do(): Promise<void> {
    throw new HttpResultError(
      new HttpResult(StatusCode.badRequest, <ErrorMessage>{ message: "br" })
    );
  }
  constructor() {
    super();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).response = new HttpResult(StatusCode.ok);
  }
}
