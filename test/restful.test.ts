import { RequestMethod, Router } from "../src/index";

const methods = [
  RequestMethod.get,
  RequestMethod.connect,
  RequestMethod.delete,
  RequestMethod.post,
  RequestMethod.head,
  RequestMethod.options,
  RequestMethod.patch,
  RequestMethod.put,
  RequestMethod.trace,
];

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

test(`restful query test`, async function () {
  let event = {
    body: {},
    path: "/restful/45",
    httpMethod: "GET",
  };
  let router = new Router(event, {}, undefined, "test/controllers");

  let result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("45");

  event = {
    body: {},
    path: "/restful/11/animals",
    httpMethod: "GET",
  };
  router = new Router(event, {}, undefined, "test/controllers");

  result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("11");
});

test(`method not allowed`, async function () {
  const event = {
    body: {},
    path: "/restful",
    httpMethod: "NO",
  };
  const router = new Router(event, {}, undefined, "test/controllers");
  const result = (await router.do()).result;
  expect(result.statusCode).toBe(405);
});

test(`find next`, async function () {
  const event = {
    body: {},
    path: "/restful/method",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");
  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test(`action name error`, async function () {
  const event = {
    body: {},
    path: "/err",
    httpMethod: RequestMethod.post,
  };
  const router = new Router(event, {}, undefined, "test/controllers");
  const result = (await router.do()).result;
  expect(result.statusCode).toBe(404);
});
