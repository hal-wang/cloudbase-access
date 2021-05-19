import { ErrorMessage, Startup } from "../src";
import StatusCode from "../src/HttpResult/StatusCode";

test("router test", async function () {
  const event = {
    body: {},
    path: "/error",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  startup.useRouter("test/controllers");

  await startup.do();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(StatusCode.badRequest);
  expect((result.body as ErrorMessage).message).toBe("br");
});
