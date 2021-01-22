import { Router } from "../src/index";

const methods = ["GET", "POST", "DELETE", "PUT", "PATCH"];

methods.forEach((method) => {
  test(`${method} restful test`, async function () {
    const event = {
      body: {},
      path: "/restful",
      httpMethod: method,
    };
    const router = new Router(event, {}, undefined, "test/controllers");

    const result = (await router.do()).result;
    expect(result.statusCode).toBe(200);
    expect((result.body as Record<string, unknown>).method).toBe(method);
  });
});

test(`method not allowed restful test`, async function () {
  const event = {
    body: {},
    path: "/restful",
    httpMethod: "POST1",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(405);
});
