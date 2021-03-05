import RequestMethod from "./RequestMethod";

export default class RequestParams {
  readonly headers: Record<string, string | undefined>;
  readonly params: Record<string, string | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;

  readonly path: string;
  readonly method: RequestMethod;

  readonly query = <Record<string, string>>{};

  constructor(
    public readonly event: Record<string, unknown>,
    public readonly context: Record<string, unknown>
  ) {
    this.path = this.getPath(<string>event.path);
    this.method = <RequestMethod>event.httpMethod;

    this.headers = <Record<string, string | undefined>>event.headers;
    this.params = <Record<string, string | undefined>>(
      event.queryStringParameters
    );

    this.data = this.getData(event.body, this.headers);
  }

  private getData(
    body: unknown,
    headers: Record<string, string | undefined>
  ): unknown {
    if (
      body &&
      headers &&
      headers["content-type"] &&
      headers["content-type"].includes("application/json") &&
      typeof body == "string"
    ) {
      return <Record<string, unknown>>JSON.parse(body);
    } else {
      return body || {};
    }
  }

  private getPath(path: string) {
    if (!path || !path.startsWith("/")) return path;
    else return path.substr(1, path.length - 1);
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
