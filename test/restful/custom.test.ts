import { HttpMethod, Router } from "../../src/index";

test(`custom httpMethod test`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const router = new Router(event, {});
  router.useRouter("test/controllers");
  HttpMethod.custom.push("CUSTOM");
  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
});

test(`custom httpMethod test err`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const router = new Router(event, {});
  router.useRouter("test/controllers");
  HttpMethod.custom.splice(0);
  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(405);
});
