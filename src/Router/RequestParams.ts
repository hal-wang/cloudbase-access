export default class RequestParams {
  readonly headers: Record<string, string | undefined>;
  readonly params: Record<string, string | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;

  readonly path: string;
  readonly method: string;

  constructor(
    public readonly event: Record<string, unknown>,
    public readonly context: Record<string, unknown>
  ) {
    this.path = event.path as string;
    this.method = event.httpMethod as string;

    this.headers = <Record<string, string | undefined>>event.headers;
    this.params = <Record<string, string | undefined>>(
      event.queryStringParameters
    );

    const body = event.body;
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
