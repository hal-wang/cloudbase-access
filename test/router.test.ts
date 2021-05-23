import { Startup } from "../src/index";
import TestConfig from "./TestConfig";

test("startup test", async function () {
  const event = {
    body: {},
    path: "/simple/RoUtEr",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("startup not exist", async function () {
  const event = {
    body: {},
    path: "/simple/router1",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(404);
});

test("shallow startup test", async function () {
  const event = {
    body: {},
    path: "/router",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("deep startup test", async function () {
  const event = {
    body: {},
    path: "/simple/deepActions/RoUtEr",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("strict test", async function () {
  let event = {
    body: {},
    path: "/simple/Router",
    httpMethod: "POST",
  };

  let startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir, strict: false });
  startup.useRouter();
  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);

  startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir, strict: true });
  startup.useRouter();
  await startup.invoke();
  expect(startup.result.statusCode).toBe(404);

  event = {
    body: {},
    path: "/restful",
    httpMethod: "PUT",
  };

  startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir, strict: false });
  startup.useRouter();
  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);

  startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir, strict: true });
  startup.useRouter();
  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("null body test", async function () {
  const event = {
    path: "/nullbody",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});
