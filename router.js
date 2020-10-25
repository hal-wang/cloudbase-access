const errRequest = require("./result/errRequest");
const forbidden = require("./result/forbidden");

class Router {
  constructor(event, auth) {
    this.event = event;
    this.auth = auth.bind(this);

    this.headers = this.event.headers;
    this.path = this.event.path;
    this.params = this.event.queryStringParameters;
    this.data = this.bodyData;

    this._initModule();
  }

  _initModule() {
    try {
      this.module = require(`${process.cwd()}/controllers${this.path}.js`);
    } catch (err) {
      throw new RouterError("Can't find a path：" + err.message, this);
    }
  }

  async do() {
    if (this.auth && !(await this.auth())) {
      return forbidden();
    }

    try {
      return await this.module.action(this.requestParams);
    } catch (err) {
      return errRequest(err.message);
    }
  }

  get requestParams() {
    return {
      event: this.event,
      headers: this.headers,
      path: this.path,
      params: this.params,
      data: this.data,
    };
  }

  get bodyData() {
    const body = this.event.body;

    let data;
    try {
      data = JSON.parse(body);
      if (!data) data = body;
    } catch {
      data = body;
    }
    return data;
  }
}

module.exports = Router;
