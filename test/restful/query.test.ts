import { HttpMethod, Startup } from "../../src/index";
import TestConfig from "../TestConfig";

test(`restful query test1`, async function () {
  const event = {
    body: {},
    path: "/restful/45",
    httpMethod: HttpMethod.get,
  };
  const startup = new Startup(event, {}).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });

  const result = await startup.invoke();
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("45");
});

test(`restful query test2`, async function () {
  const event = {
    body: {},
    path: "/restful/11/animals",
    httpMethod: HttpMethod.get,
  };
  const startup = new Startup(event, {}).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });

  const result = await startup.invoke();
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("11");
});
