"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cloudbase_access_1 = require("@hal-wang/cloudbase-access");
const Auth_1 = require("./lib/Auth");
const main = async (event, context) => {
    console.log("event", event);
    setHeaders();
    const router = new cloudbase_access_1.Router(event, context, new Auth_1.default());
    try {
        return (await router.do()).result;
    }
    catch (err) {
        console.log("err", err);
        return cloudbase_access_1.HttpResult.errRequest(err.message).result;
    }
};
exports.main = main;
function setHeaders() {
    const config = require("./package.json");
    cloudbase_access_1.HttpResult.baseHeaders.version = config.version;
    cloudbase_access_1.HttpResult.baseHeaders.demo = "cloudbase-access-demo";
}
