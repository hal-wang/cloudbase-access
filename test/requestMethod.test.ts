import { Startup } from "../src/index";
import TestConfig from "./TestConfig";

test("request method lower case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  ).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("request method upper case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "POST",
    },
    {}
  ).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});
