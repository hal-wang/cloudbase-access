import { Response, Startup } from "../src/index";
import TestConfig from "./TestConfig";

test("router test", async function () {
  const event = <Record<string, unknown>>{
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  Response.baseHeaders["custom-header"] = "aaa";
  const startup = new Startup(event, {}).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
  expect(startup.result.headers["custom-header"]).toBe("aaa");
});
