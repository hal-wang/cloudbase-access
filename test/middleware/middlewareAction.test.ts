import {
  Middleware,
  MiddlewareResult,
  MiddlewareType,
  Router,
} from "../../src";

test("middleware action", async function () {
  const event = {
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  router.configure(new BeforeStartMdw());
  router.configure(new BeforeActionMdw());
  router.configure(new BeforeSuccessEndMdw());
  router.configure(new BeforeErrorEndMdw());
  router.configure(new BeforeEndMdw());

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect(result.headers.beforeStartAction).toBe(String(false));
  expect(result.headers.beforeActionAction).toBe(String(true));
  expect(result.headers.beforeSuccessEndAction).toBe(String(true));
  expect(result.headers.beforeErrorEndAction).toBe(undefined);
  expect(result.headers.beforeEndAction).toBe(String(true));
});

class BeforeStartMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeStart);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeStartAction = String(!!this.action);
    return result;
  }
}

class BeforeActionMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeAction);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeActionAction = String(!!this.action);
    return result;
  }
}

class BeforeSuccessEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeSuccessEnd);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeSuccessEndAction = String(!!this.action);
    return result;
  }
}

class BeforeErrorEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeErrEnd);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeErrorEndAction = String(!!this.action);
    return result;
  }
}

class BeforeEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeEnd);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeEndAction = String(!!this.action);
    return result;
  }
}
