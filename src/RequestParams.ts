export default class RequestParams {
  readonly headers: Record<string, string | undefined>;
  readonly path: string;
  readonly params: Record<string, string | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;

  constructor(
    public readonly event: Record<string, unknown>,
    public readonly context: Record<string, unknown>
  ) {
    this.headers = <Record<string, string | undefined>>this.event.headers;
    this.path = <string>this.event.path;
    this.params = <Record<string, string | undefined>>(
      this.event.queryStringParameters
    );

    const body = this.event.body;
    if (
      this.headers &&
      this.headers["content-type"] &&
      this.headers["content-type"].includes("application/json") &&
      typeof body == "string"
    ) {
      this.data = <Record<string, unknown>>JSON.parse(body);
    } else {
      this.data = body;
    }
  }

  static get empty(): RequestParams {
    return new RequestParams(
      {
        headers: {},
        path: null,
        params: {},
        data: {},
      },
      {}
    );
  }
}
