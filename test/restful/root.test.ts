import { HttpMethod, Router } from "../../src";

test("restful root get", async function () {
  const event = {
    body: {},
    path: "/",
    httpMethod: "GET",
  };
  const router = new Router(event, {});
  router.useRouter("test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((result.body as any).method).toBe(HttpMethod.get);
});
