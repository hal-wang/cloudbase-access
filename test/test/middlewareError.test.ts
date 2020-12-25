import {
  HttpResult,
  Middleware,
  MiddlewareType,
  Router,
} from "@hal-wang/cloudbase-access";

test("middleware test err", async function () {
  const stepResult: Record<string, number> = {
    step: 0,
  };

  const event = {
    body: {},
    path: "/actions/notExist",
  };
  const router = new Router(event, {}, undefined, "dist");

  router.configure(new BeforeStartMdw(stepResult));

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(404);
  expect(stepResult.step).toBe(0);
});

class BeforeStartMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeStart);
  }

  async do(): Promise<HttpResult | null> {
    this.stepResult.step += 1;
    return null;
  }
}
