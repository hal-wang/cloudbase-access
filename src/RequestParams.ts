export default class RequestParams {
  readonly headers: any;
  readonly path: String;
  readonly params: any;
  readonly data: any;

  constructor(public readonly event: any) {
    this.headers = this.event.headers;
    this.path = this.event.path;
    this.params = this.event.queryStringParameters;
    this.data = this.bodyData;
  }

  private get bodyData() {
    const body = this.event.body;

    let data: any;
    try {
      data = JSON.parse(body);
      if (!data) data = body;
    } catch {
      data = body;
    }
    return data;
  }
}
