import { Startup } from "../src/index";

test("startup test", async function () {
  const event = {
    body: {},
    path: "/simple/RoUtEr",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
});

test("startup not exist", async function () {
  const event = {
    body: {},
    path: "/simple/router1",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(404);
});

test("shallow startup test", async function () {
  const event = {
    body: {},
    path: "/router",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
});

test("deep startup test", async function () {
  const event = {
    body: {},
    path: "/simple/deepActions/RoUtEr",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
});

test("isMethodNecessary test", async function () {
  let event = {
    body: {},
    path: "/simple/Router",
    httpMethod: "POST",
  };

  let startup = new Startup(event, {});
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    forceIsMethodNecessary: false,
  });
  await startup.invoke();
  let result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);

  startup = new Startup(event, {});
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    forceIsMethodNecessary: true,
  });
  await startup.invoke();
  result = startup.httpContext.response;
  expect(result.statusCode).toBe(404);

  event = {
    body: {},
    path: "/restful",
    httpMethod: "PUT",
  };

  startup = new Startup(event, {});
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    forceIsMethodNecessary: false,
  });
  await startup.invoke();
  result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);

  startup = new Startup(event, {});
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    forceIsMethodNecessary: true,
  });
  await startup.invoke();
  result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
});

test("null body test", async function () {
  const event = {
    path: "/nullbody",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
});
