"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudbase_access_1 = require("@hal-wang/cloudbase-access");
/**admin 权限验证 */
class default_1 extends cloudbase_access_1.Action {
    constructor() {
        super(["admin"]);
    }
    async do() {
        const { account } = this.requestParams.headers;
        return this.ok({
            account,
            msg: "admin",
        });
    }
}
exports.default = default_1;
