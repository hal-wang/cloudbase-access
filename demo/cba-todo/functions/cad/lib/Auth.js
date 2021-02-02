"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudbase_access_1 = require("@hal-wang/cloudbase-access");
const linq = require("linq");
const Global_1 = require("./Global");
class Auth extends cloudbase_access_1.Authority {
    async do() {
        if (!this.roles || !this.roles.length) {
            return cloudbase_access_1.MiddlewareResult.getSuccessResult();
        }
        if ((this.roles.includes("login") || this.roles.includes("admin")) &&
            !this.loginAuth()) {
            return cloudbase_access_1.MiddlewareResult.getFailedResult(cloudbase_access_1.HttpResult.forbiddenMsg({ message: "账号或密码错误" }));
        }
        if (this.roles.includes("admin") && !this.adminAuth()) {
            return cloudbase_access_1.MiddlewareResult.getFailedResult(cloudbase_access_1.HttpResult.forbiddenMsg({ message: "不是管理员" }));
        }
        return cloudbase_access_1.MiddlewareResult.getSuccessResult();
    }
    adminAuth() {
        const { account } = this.requestParams.headers;
        return account == Global_1.default.adminAccount;
    }
    loginAuth() {
        const { account, password } = this.requestParams.headers;
        return (linq
            .from(Global_1.default.users)
            .where((u) => u.account == account && u.password == password)
            .count() > 0);
    }
}
exports.default = Auth;
