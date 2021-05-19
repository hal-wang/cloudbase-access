import { Middleware, Router } from "../../src/index";

test("middleware additives", async function () {
  const event = {
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  const router = new Router(event, {});

  router.use(new Mdw1());
  router.use(new Mdw2());
  router.use(new Mdw3());
  router.use(new Mdw4());
  router.useRouter("test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
  expect(result.headers.mdw1).toBe("mdw1");
  expect(result.headers.mdw2).toBe("mdw2");
  expect(!!result.headers.mdw2).toBe(true);
  expect(!!result.headers.mdw3).toBe(false);
  expect(!!result.headers.mdw4).toBe(false);
});

class Mdw1 extends Middleware {
  async do(): Promise<void> {
    this.response.headers.mdw1 = "mdw1";
    await this.next();
  }
}

class Mdw2 extends Middleware {
  async do(): Promise<void> {
    this.response.headers.mdw2 = "mdw2";
    await this.next();
  }
}

class Mdw3 extends Middleware {
  async do(): Promise<void> {
    this.ok();
  }
}

class Mdw4 extends Middleware {
  async do(): Promise<void> {
    this.response.headers.mdw4 = "mdw4";
    await this.next();
  }
}
