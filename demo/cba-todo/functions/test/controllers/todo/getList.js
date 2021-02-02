"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudbase_access_1 = require("@hal-wang/cloudbase-access");
/**login 权限验证 */
class default_1 extends cloudbase_access_1.Action {
    constructor() {
        super(["login"]);
    }
    async do() {
        const { account } = this.requestParams.headers;
        return this.ok([
            {
                id: "1",
                content: "todo 1",
            },
            {
                id: "2",
                content: "todo 2",
            },
            {
                id: "3",
                content: "todo 3",
            },
            {
                id: "4",
                content: "todo account: " + account,
            },
        ]);
    }
}
exports.default = default_1;
