export default class HttpResult {
  constructor(
    public readonly statusCode: number,
    public readonly body?: unknown,
    public readonly headers?: Record<string, unknown>
  ) {}

  get result(): Record<string, unknown> {
    return <Record<string, unknown>>{
      isBase64: false,
      statusCode: this.statusCode,
      headers: Object.assign(HttpResult.baseHeaders, this.headers),
      body: this.body,
    };
  }

  get isSuccess(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  static readonly baseHeaders = <Record<string, unknown>>{
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "nodejs-api": "cloudbase-access",
  };

  static base = function (
    statusCode: number,
    body?: unknown,
    headers?: Record<string, unknown>
  ): HttpResult {
    return new HttpResult(statusCode, body, headers);
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

  static redirect = function (
    location: string,
    code: 301 | 302 = 301
  ): HttpResult {
    return new HttpResult(code, {}, { location });
  };
}
