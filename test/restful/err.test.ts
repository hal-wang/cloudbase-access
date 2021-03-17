import { HttpMethod, Router } from "../../src/index";

test(`action name error`, async function () {
  const event = {
    body: {},
    path: "/err",
    httpMethod: HttpMethod.post,
  };
  const router = new Router(event, {}, undefined, "test/controllers");
  const result = (await router.do()).result;
  expect(result.statusCode).toBe(404);
});
