import { Startup } from "../../src/index";
import TestConfig from "../TestConfig";

test(`method not allowed`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "NO",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();
  const result = await startup.invoke();
  expect(result.statusCode).toBe(405);
});
