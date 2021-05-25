import { ErrorMessage, Startup } from "../src";
import StatusCode from "../src/Response/StatusCode";
import "./UseTest";
import "../src/Router";

test("router test", async function () {
  const event = {
    body: {},
    path: "/error",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {}).useTest().useRouter();

  await startup.invoke();

  expect(startup.result.statusCode).toBe(StatusCode.badRequest);
  expect((startup.result.body as ErrorMessage).message).toBe("br");
});
