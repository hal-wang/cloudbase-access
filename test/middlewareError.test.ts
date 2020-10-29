import { HttpResult, Middleware, Router } from "../index";
import { MiddlewareType } from "../src/Middleware";

let step: number = 0;

test("middleware test err", async function () {
  const router = new Router(
    {
      body: {},
      path: "/actions/notExist",
    },
    null,
    "test"
  );

  router.configure(new BeforeStartMdw());
  router.configure(new BeforeActionMdw());
  router.configure(new BeforeSuccessEndMdw());
  router.configure(new BeforeErrEndMdw());

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(404);
  expect(step).toBe(1);
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
