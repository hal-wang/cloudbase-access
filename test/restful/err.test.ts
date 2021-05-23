import { HttpMethod, Startup } from "../../src/index";
import TestConfig from "../TestConfig";

test(`action name error`, async function () {
  const event = {
    body: {},
    path: "/err",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {}).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  await startup.invoke();
  const result = await startup.invoke();
  expect(result.statusCode).toBe(404);
});
