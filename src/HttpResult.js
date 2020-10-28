"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpResult {
    constructor(statusCode, body, headers, cors) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
        this.cors = cors;
    }
    get result() {
        return {
            isBase64: false,
            statusCode: this.statusCode,
            headers: this.finalHeaders,
            body: this.body,
        };
    }
    get finalHeaders() {
        let headers = {
            "Content-Type": "application/json",
        };
        if (this.cors) {
            headers = Object.assign({ "Access-Control-Allow-Origin": "*" }, headers);
        }
        headers = Object.assign(headers, this.headers);
        return headers;
    }
    static get funcs() {
        return {
            base: HttpResult.base,
            ok: HttpResult.ok,
            accepted: HttpResult.accepted,
            noContent: HttpResult.noContent,
            partialContent: HttpResult.partialContent,
            badRequest: HttpResult.badRequest,
            forbidden: HttpResult.forbidden,
            notFound: HttpResult.notFound,
            errRequest: HttpResult.errRequest,
        };
    }
}
exports.default = HttpResult;
HttpResult.base = function (statusCode, body, headers, cors) {
    return new HttpResult(statusCode, body, headers, cors).result;
};
HttpResult.ok = function (body) {
    return new HttpResult(200, body).result;
};
HttpResult.accepted = function (body) {
    return new HttpResult(202, body).result;
};
HttpResult.noContent = function (body) {
    return new HttpResult(204, body).result;
};
HttpResult.partialContent = function (body) {
    return new HttpResult(206, body).result;
};
HttpResult.badRequest = function (body) {
    return new HttpResult(400, body).result;
};
HttpResult.forbidden = function (body) {
    return new HttpResult(403, body).result;
};
HttpResult.notFound = function (body) {
    return new HttpResult(404, body).result;
};
HttpResult.errRequest = function (body) {
    return new HttpResult(500, body).result;
};
//# sourceMappingURL=HttpResult.js.map