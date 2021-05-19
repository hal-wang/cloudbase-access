import { Router } from "../../src/index";

test(`method not allowed`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "NO",
  };
  const router = new Router(event, {}, undefined, "test/controllers");
  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(405);
});
