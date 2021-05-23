import { Startup } from "../src/index";
import TestConfig from "./TestConfig";

test("request method lower case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  );
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();

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
  );
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});
