import { HttpMethod, Startup } from "../../src/index";

test(`find next`, async function () {
  const event = {
    body: {},
    path: "/restful/method",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
});

test(`find simple`, async function () {
  const event = {
    body: {},
    path: "/restful/method/simple",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, string>).action).toBe("simple");
});

test(`find simple next`, async function () {
  const event = {
    body: {},
    path: "/restful/method/any",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, string>).action).toBe("query");
});

test(`find miss next`, async function () {
  const event = {
    body: {},
    path: "/restful/method/miss",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, string>).action).toBe("miss");
  expect((result.body as Record<string, string>).action).not.toBe("query");
});

test(`find miss next 2`, async function () {
  const event = {
    body: {},
    path: "/restful/method/miss/any",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, string>).action).toBe("miss/query");
});

test(`find miss next 3`, async function () {
  const event = {
    body: {},
    path: "/restful/method/any/miss",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, string>).action).toBe("query/miss");
});

test(`find miss next 4`, async function () {
  const event = {
    body: {},
    path: "/restful/method/any/any",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, string>).action).toBe(
    "query2/nextQuery"
  );
});
