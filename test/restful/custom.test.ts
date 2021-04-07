import { HttpMethod, Router } from "../../src/index";

test(`custom httpMethod test`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const router = new Router(event, {}, undefined, "test/controllers");
  HttpMethod.custom.push("CUSTOM");
  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test(`custom httpMethod test err`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const router = new Router(event, {}, undefined, "test/controllers");
  HttpMethod.custom.splice(0);
  const result = (await router.do()).result;
  expect(result.statusCode).toBe(405);
});
