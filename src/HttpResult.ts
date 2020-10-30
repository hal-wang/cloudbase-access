export default class HttpResult {
  constructor(
    public readonly statusCode: number,
    public readonly body?: unknown,
    public readonly headers?: Record<string, unknown>,
    public readonly cors?: boolean
  ) {}

  get result(): Record<string, unknown> {
    return {
      isBase64: false,
      statusCode: this.statusCode,
      headers: this.finalHeaders,
      body: this.body,
    };
  }

  get isSuccess(): boolean {
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
    body?: unknown,
    headers?: Record<string, unknown>,
    cors?: boolean
  ): HttpResult {
    return new HttpResult(statusCode, body, headers, cors);
  };

  static ok = function (body?: unknown): HttpResult {
    return new HttpResult(200, body);
  };

  static accepted = function (body?: unknown): HttpResult {
    return new HttpResult(202, body);
  };

  static noContent = function (): HttpResult {
    return new HttpResult(204);
  };

  static partialContent = function (body?: unknown): HttpResult {
    return new HttpResult(206, body);
  };

  static badRequest = function (body?: unknown): HttpResult {
    return new HttpResult(400, body);
  };

  static forbidden = function (body?: unknown): HttpResult {
    return new HttpResult(403, body);
  };

  static notFound = function (body?: unknown): HttpResult {
    return new HttpResult(404, body);
  };

  static errRequest = function (body?: unknown): HttpResult {
    return new HttpResult(500, body);
  };
}
