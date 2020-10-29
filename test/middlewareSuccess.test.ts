import { HttpResult, Middleware, Router } from "../index";
import { MiddlewareType } from "../src/Middleware";

let step: number = 0;

test("middleware test success", async function () {
  const router = new Router(
    {
      body: {},
      path: "/actions/router",
    },
    null,
    "test"
  );

  router.configure(new BeforeStartMdw());
  router.configure(new BeforeActionMdw());
  router.configure(new BeforeSuccessEndMdw());
  router.configure(new BeforeErrEndMdw());

  console.log("mdw", MiddlewareType.BeforeAction, MiddlewareType.BeforeErrEnd);

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect(step).toBe(111);
});

class BeforeStartMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeStart);
  }

  do(): Promise<HttpResult> {
    step += 1;
    return null;
  }
}

class BeforeActionMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeAction);
  }

  do(): Promise<HttpResult> {
    step += 10;
    return null;
  }
}

class BeforeSuccessEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeSuccessEnd);
  }

  do(): Promise<HttpResult> {
    step += 100;
    return null;
  }
}

class BeforeErrEndMdw extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeErrEnd);
  }

  do(): Promise<HttpResult> {
    step += 1000;
    return null;
  }
}
