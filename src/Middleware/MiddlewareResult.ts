import HttpResult from "../HttpResult";

class MiddlewareResult {
  constructor(
    public readonly success: boolean,
    public readonly failedResult: HttpResult = HttpResult.errRequest()
  ) {}

  static getSuccessResult(): MiddlewareResult {
    return new MiddlewareResult(true);
  }
  static getFailedResult(httpResult: HttpResult): MiddlewareResult {
    return new MiddlewareResult(false, httpResult);
  }
}

export default MiddlewareResult;
