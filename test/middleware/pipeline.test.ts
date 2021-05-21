import { Middleware, Startup } from "../../src/index";

test("middleware additives", async function () {
  const event = {
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});

  startup.use(() => new Mdw1());
  startup.use(() => new Mdw2());
  startup.use(() => new Mdw3());
  startup.use(() => new Mdw4());
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
  expect(result.headers.mdw1).toBe("mdw1");
  expect(result.headers.mdw2).toBe("mdw2");
  expect(!!result.headers.mdw2).toBe(true);
  expect(!!result.headers.mdw3).toBe(false);
  expect(!!result.headers.mdw4).toBe(false);
});

class Mdw1 extends Middleware {
  async invoke(): Promise<void> {
    this.httpContext.response.headers.mdw1 = "mdw1";
    await this.next();
  }
}

class Mdw2 extends Middleware {
  async invoke(): Promise<void> {
    this.httpContext.response.headers.mdw2 = "mdw2";
    await this.next();
  }
}

class Mdw3 extends Middleware {
  async invoke(): Promise<void> {
    this.ok();
  }
}

class Mdw4 extends Middleware {
  async invoke(): Promise<void> {
    this.httpContext.response.headers.mdw4 = "mdw4";
    await this.next();
  }
}
