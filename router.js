const notFound = require("./result/notFound");
const errRequest = require("./result/errRequest");
const forbidden = require("./result/forbidden");

class Router {
  constructor(auth) {
    this.auth = auth;
  }

  async do({ headers, data, path, params, event }) {
    let actionModule;
    try {
      actionModule = require(`./controllers${path}.js`);
    } catch (err) {
      console.log("require action err", err);
      return notFound("Can't find a path：" + err.message);
    }

    if (
      this.auth &&
      !(await this.auth({
        headers,
        data,
        path,
        params,
        event,
      }))
    ) {
      return forbidden();
    }

    try {
      return await actionModule.action({ headers, data, path, params, event });
    } catch (err) {
      return errRequest(err.message);
    }
  }
}

module.exports = Router;
