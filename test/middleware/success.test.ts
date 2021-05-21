import { Middleware, Startup } from "../../src/index";

test("middleware test success", async function () {
  const stepResult: Record<string, number> = {
    step: 0,
  };

  const event = {
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});

  startup.use(() => new Mdw1(stepResult));
  startup.use(() => new Mdw2(stepResult));
  startup.use(() => new Mdw3(stepResult));
  startup.use(() => new Mdw4(stepResult));
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
  expect(stepResult.step).toBe(111);
  expect(startup.ctx.res.body).toBe("middleware-success");
});

class Mdw1 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 1;
    await this.next();
  }
}

class Mdw2 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 10;
    await this.next();
  }
}

class Mdw3 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 100;
    this.ok("middleware-success");
  }
}

class Mdw4 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 1000;
    await this.next();
  }
}
