import { Router } from "../../src/index";

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
