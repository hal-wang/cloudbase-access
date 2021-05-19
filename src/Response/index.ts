import ResponseStruct from "./ResponseStruct";
import StatusCode from "./StatusCode";

export default class Response {
  constructor(
    public statusCode: StatusCode | number,
    public body: unknown = {},
    public readonly headers = <Record<string, string>>{},
    public isBase64 = false
  ) {}

  get result(): ResponseStruct {
    return <ResponseStruct>{
      isBase64Encoded: this.isBase64,
      statusCode: this.statusCode,
      headers: Object.assign(Response.baseHeaders, this.headers),
      body: this.body,
    };
  }

  get isSuccess(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  update(
    val: {
      statusCode?: StatusCode | number;
      body?: unknown;
      isBase64?: boolean;
      headers?: Record<string, string>;
    } = {}
  ): Response {
    if (val.statusCode != undefined) {
      this.statusCode = val.statusCode;
    }
    if (val.body != undefined) {
      this.body = val.body;
    }
    if (val.isBase64 != undefined) {
      this.isBase64 = val.isBase64;
    }
    if (val.headers != undefined) {
      Object.keys(val.headers).forEach((key) => {
        if (val.headers) {
          this.headers[key] = val.headers[key];
        }
      });
    }
    return this;
  }

  static readonly baseHeaders = <Record<string, string>>{
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "nodejs-api": "cloudbase-access",
  };
}
