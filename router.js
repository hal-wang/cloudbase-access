const notFound = require("./result/notFound");
const errRequest = require("./result/errRequest");
const forbidden = require("./result/forbidden");

class Router {
  constructor(event, auth, getModule) {
    this.event = event;
    this.auth = auth;
    this.getModule = getModule;

    this.headers = this.event.headers;
    this.path = this.event.path;
    this.params = this.event.queryStringParameters;
    this.data = this.getBodyData;
  }

  async do() {
    let actionModule;
    try {
      actionModule = this.getModule();
    } catch (err) {
      console.log("require action err", err);
      return notFound("Can't find a path：" + err.message);
    }

    if (this.auth && !(await this.auth(this.requestParams))) {
      return forbidden();
    }

    try {
      return await actionModule.action(this.requestParams);
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
