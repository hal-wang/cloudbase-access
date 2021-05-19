import { HttpMethod, Router } from "../../src/index";

test(`restful query test`, async function () {
  let event = {
    body: {},
    path: "/restful/45",
    httpMethod: HttpMethod.get,
  };
  let router = new Router(event, {}, undefined, "test/controllers");

  await router.do();
  let result = router.response;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("45");

  event = {
    body: {},
    path: "/restful/11/animals",
    httpMethod: HttpMethod.get,
  };
  router = new Router(event, {}, undefined, "test/controllers");

  await router.do();
  result = router.response;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("11");
});
