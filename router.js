const errRequest = require("./result/errRequest");
const forbidden = require("./result/forbidden");
const notFound = require("./result/notFound");

const Results = require("./result/index");

class Router {
  constructor(event, auth) {
    this.event = event;
    this.auth = auth ? auth.bind(this) : undefined;

    this.headers = this.event.headers;
    this.path = this.event.path;
    this.params = this.event.queryStringParameters;
    this.data = this.bodyData;

    for (let key in Results) {
      this[key] = Results[key];
    }
  }

  _initModule() {
    if (this.module) return;

    try {
      this.module = require(`${process.cwd()}/controllers${this.path}.js`);
    } catch (err) {
      this.module = null;
    }
  }

  async do() {
    this._initModule();
    if (!this.module) return notFound("Can't find a path：" + this.path);

    try {
      if (this.auth && !(await this.auth())) {
        return forbidden();
      }

      const action = this.module.action.bind(this);
      return await action(this.requestParams);
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
