"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
class ActionTest extends index_1.BaseAction {
    constructor(requestParams) {
        super(requestParams);
    }
    do() {
        return this.ok("action");
    }
}
exports.default = ActionTest;
//# sourceMappingURL=action.js.map