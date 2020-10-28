"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResult_1 = require("./HttpResult");
class BaseAction {
    constructor(requestParams, auth) {
        this.requestParams = requestParams;
        this.auth = auth;
        this.base = HttpResult_1.default.base;
        this.ok = HttpResult_1.default.ok;
        this.accepted = HttpResult_1.default.accepted;
        this.noContent = HttpResult_1.default.noContent;
        this.partialContent = HttpResult_1.default.partialContent;
        this.badRequest = HttpResult_1.default.badRequest;
        this.forbidden = HttpResult_1.default.forbidden;
        this.notFound = HttpResult_1.default.notFound;
        this.errRequest = HttpResult_1.default.errRequest;
    }
}
exports.default = BaseAction;
//# sourceMappingURL=BaseAction.js.map