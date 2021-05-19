import { Middleware, Router } from "../../src/index";

test("middleware test success", async function () {
  const stepResult: Record<string, number> = {
    step: 0,
  };

  const event = {
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  router.use(new Mdw1(stepResult));
  router.use(new Mdw2(stepResult));
  router.use(new Mdw3(stepResult));
  router.use(new Mdw4(stepResult));

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
  expect(stepResult.step).toBe(111);
  expect(router.response.body).toBe("middleware-success");
});

class Mdw1 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async do(): Promise<void> {
    this.stepResult.step += 1;
    await this.next();
  }
}

class Mdw2 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async do(): Promise<void> {
    this.stepResult.step += 10;
    await this.next();
  }
}

class Mdw3 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async do(): Promise<void> {
    this.stepResult.step += 100;
    this.ok("middleware-success");
  }
}

class Mdw4 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async do(): Promise<void> {
    this.stepResult.step += 1000;
    await this.next();
  }
}
