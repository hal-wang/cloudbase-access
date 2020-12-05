export default class RequestParams {
  readonly headers: Record<string, string>;
  readonly path: string;
  readonly params: Record<string, string>;
  readonly data: Record<string, unknown>;

  constructor(public readonly event: Record<string, unknown>) {
    this.headers = <Record<string, string>>this.event.headers;
    this.path = <string>this.event.path;
    this.params = <Record<string, string>>this.event.queryStringParameters;

    const body = this.event.body;
    if (
      this.headers &&
      this.headers["content-type"] &&
      this.headers["content-type"].includes("application/json")
    ) {
      if (typeof body == "string") {
        this.data = <Record<string, unknown>>JSON.parse(body);
      } else {
        this.data = <Record<string, unknown>>body;
      }
    } else {
      this.data = <Record<string, unknown>>body;
    }
  }

  static get empty(): RequestParams {
    return new RequestParams({
      headers: {},
      path: null,
      params: {},
      data: {},
    });
  }
}
