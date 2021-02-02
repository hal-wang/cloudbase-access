"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudbase_access_1 = require("@hal-wang/cloudbase-access");
const Global_1 = require("../../lib/Global");
const linq = require("linq");
class default_1 extends cloudbase_access_1.Action {
    async do() {
        const { account, password } = this.requestParams.data;
        if (linq
            .from(Global_1.default.users)
            .where((u) => u.account == account && u.password == password)
            .count() == 0) {
            return this.notFound("账号或密码错误");
        }
        return this.ok({
            account,
            more: "... more info ...",
        });
    }
}
exports.default = default_1;
