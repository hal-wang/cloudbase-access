import ErrorMessage from "./ErrorMessage";

interface HttpResultStruct {
  isBase64: boolean;
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
}

export default class HttpResult {
  constructor(
    public readonly statusCode: number,
    public readonly body?: unknown,
    public readonly headers?: Record<string, unknown>
  ) {}

  get result(): HttpResultStruct {
    return <HttpResultStruct>{
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
  static badRequestMsg = function (msg?: ErrorMessage): HttpResult {
    if (!msg) {
      msg = <ErrorMessage>{
        message: "Bad Request",
      };
    }

    return HttpResult.badRequest(msg);
  };

  static forbidden = function (body?: unknown): HttpResult {
    return new HttpResult(403, body);
  };
  static forbiddenMsg = function (msg?: ErrorMessage): HttpResult {
    if (!msg) {
      msg = <ErrorMessage>{
        message: "Forbidden",
      };
    }

    return HttpResult.forbidden(msg);
  };

  static notFound = function (body?: unknown): HttpResult {
    return new HttpResult(404, body);
  };
  static notFoundMsg = function (msg?: ErrorMessage): HttpResult {
    if (!msg) {
      msg = <ErrorMessage>{
        message: "Not Found",
      };
    }

    return HttpResult.notFound(msg);
  };

  static errRequest = function (body?: unknown): HttpResult {
    return new HttpResult(500, body);
  };
  static errRequestMsg = function (msg?: ErrorMessage): HttpResult {
    if (!msg) {
      msg = <ErrorMessage>{
        message: "Error Request",
      };
    }

    return HttpResult.errRequest(msg);
  };

  static redirect = function (
    location: string,
    code: 301 | 302 | 303 | 307 | 308 = 302
  ): HttpResult {
    return new HttpResult(code, {}, { location });
  };

  static created = function (location: string, body?: unknown): HttpResult {
    return new HttpResult(201, body, { location });
  };
}
