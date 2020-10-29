export default class HttpResult {
  constructor(
    public readonly statusCode: number,
    public readonly body?: any,
    public readonly headers?: object,
    public readonly cors?: boolean
  ) {}

  get result() {
    return {
      isBase64: false,
      statusCode: this.statusCode,
      headers: this.finalHeaders,
      body: this.body,
    } as any;
  }

  get isSuccess() {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  private get finalHeaders() {
    let headers = {
      "Content-Type": "application/json",
    };
    if (this.cors) {
      headers = Object.assign({ "Access-Control-Allow-Origin": "*" }, headers);
    }
    headers = Object.assign(headers, this.headers);

    return headers;
  }

  static base = function (
    statusCode: number,
    body?: any,
    headers?: object,
    cors?: boolean
  ) {
    return new HttpResult(statusCode, body, headers, cors);
  };

  static ok = function (body?: any) {
    return new HttpResult(200, body);
  };

  static accepted = function (body?: any) {
    return new HttpResult(202, body);
  };

  static noContent = function () {
    return new HttpResult(204);
  };

  static partialContent = function (body?: any) {
    return new HttpResult(206, body);
  };

  static badRequest = function (body?: any) {
    return new HttpResult(400, body);
  };

  static forbidden = function (body?: any) {
    return new HttpResult(403, body);
  };

  static notFound = function (body?: any) {
    return new HttpResult(404, body);
  };

  static errRequest = function (body?: any) {
    return new HttpResult(500, body);
  };
}
