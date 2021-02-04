import {
  Middleware,
  MiddlewareResult,
  Router,
  MiddlewareType,
} from "../src/index";

test("middleware additives", async function () {
  const event = {
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  router.configure(new BeforeActionMdw());
  router.configure(new BeforeStartMdw());
  router.configure(new BeforeEndMdw());
  router.configure(new BeforeSuccessEndMdw());
  router.configure(new BeforeErrEndMdw());

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect(result.headers.beforeAction).toBe("ba");
  expect(result.headers.beforeStart).toBe("bs");
  expect(result.headers.beforeEnd).toBe("bn");
  expect(result.headers.beforeSuccessEnd).toBe("bsn");
  expect(result.headers.beforeErrEnd).toBe(undefined);
});

class BeforeActionMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeAction);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeAction = "ba";
    return result;
  }
}

class BeforeStartMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeStart);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeStart = "bs";
    return result;
  }
}

class BeforeEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeEnd);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeEnd = "bn";
    return result;
  }
}

class BeforeSuccessEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeSuccessEnd);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeSuccessEnd = "bsn";
    return result;
  }
}

class BeforeErrEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeErrEnd);
  }

  async do(): Promise<MiddlewareResult> {
    const result = MiddlewareResult.getSuccessResult();
    result.additives.beforeErrEnd = "ben";
    return result;
  }
}
