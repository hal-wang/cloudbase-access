import { HttpMethod, Startup } from "../../src/index";
import TestConfig from "../TestConfig";

test(`custom httpMethod test`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {}).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  HttpMethod.custom.push("CUSTOM");
  const result = await startup.invoke();
  expect(result.statusCode).toBe(200);
});

test(`custom httpMethod test err`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {}).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  HttpMethod.custom.splice(0);
  const result = await startup.invoke();
  expect(result.statusCode).toBe(405);
});
