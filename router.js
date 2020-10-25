const notFound = require("./result/notFound");
const errRequest = require("./result/errRequest");
const forbidden = require("./result/forbidden");

class Router {
  constructor(isAccessEnableFunc) {
    this.isAccessEnableFunc = isAccessEnableFunc;
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
      this.isAccessEnableFunc &&
      !(await this.isAccessEnableFunc({
        headers,
        path,
        auth: actionModule.auth,
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
