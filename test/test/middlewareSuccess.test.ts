import {
  Middleware,
  MiddlewareResult,
  MiddlewareType,
  Router,
} from "@hal-wang/cloudbase-access";

test("middleware test success", async function () {
  const stepResult: Record<string, number> = {
    step: 0,
  };

  const event = {
    body: {},
    path: "/actions/router",
  };
  const router = new Router(event, {}, undefined, "dist");

  router.configure(new BeforeStartMdw(stepResult));
  router.configure(new BeforeActionMdw(stepResult));
  router.configure(new BeforeSuccessEndMdw(stepResult));
  router.configure(new BeforeErrEndMdw(stepResult));

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect(stepResult.step).toBe(111);
});

class BeforeStartMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeStart);
  }

  async do(): Promise<MiddlewareResult> {
    this.stepResult.step += 1;
    return MiddlewareResult.getSuccessResult();
  }
}

class BeforeActionMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeAction);
  }

  async do(): Promise<MiddlewareResult> {
    this.stepResult.step += 10;
    return MiddlewareResult.getSuccessResult();
  }
}

class BeforeSuccessEndMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeSuccessEnd);
  }

  async do(): Promise<MiddlewareResult> {
    this.stepResult.step += 100;
    return MiddlewareResult.getSuccessResult();
  }
}

class BeforeErrEndMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeErrEnd);
  }

  async do(): Promise<MiddlewareResult> {
    this.stepResult.step += 1000;
    return MiddlewareResult.getSuccessResult();
  }
}
