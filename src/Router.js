"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const HttpResult_1 = require("./HttpResult");
class Router {
    constructor(event, auth) {
        this.event = event;
        this.auth = auth ? auth.bind(this) : undefined;
        this.headers = this.event.headers;
        this.path = this.event.path;
        this.params = this.event.queryStringParameters;
        this.data = this.bodyData;
    }
    async initModule() {
        if (this.routerAction)
            return;
        if (!fs_1.existsSync(this.getFullPath())) {
            this.routerAction = null;
            return;
        }
        const actionClass = require(this.getFullPath()).default;
        this.routerAction = new actionClass(this.requestParams);
    }
    async do() {
        await this.initModule();
        if (!this.routerAction)
            return HttpResult_1.default.notFound("Can't find a path：" + this.path);
        try {
            if (this.auth && !(await this.auth())) {
                return HttpResult_1.default.forbidden();
            }
            return await this.routerAction.do();
        }
        catch (err) {
            return HttpResult_1.default.errRequest(err.message);
        }
    }
    getFullPath() {
        return `${process.cwd()}/controllers${this.path}.js`;
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
            if (!data)
                data = body;
        }
        catch {
            data = body;
        }
        return data;
    }
}
exports.default = Router;
//# sourceMappingURL=Router.js.map