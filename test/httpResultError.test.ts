import { ErrorMessage, Router } from "../src";
import StatusCode from "../src/HttpResult/StatusCode";

test("router test", async function () {
  const event = {
    body: {},
    path: "/error",
    httpMethod: "POST",
  };
  const router = new Router(event, {});
  router.useRouter("test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(StatusCode.badRequest);
  expect((result.body as ErrorMessage).message).toBe("br");
});
