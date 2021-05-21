import { ErrorMessage, Startup } from "../src";
import StatusCode from "../src/Response/StatusCode";

test("router test", async function () {
  const event = {
    body: {},
    path: "/error",
    httpMethod: "POST",
  };
  const startup = new Startup(event, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (startup as any).unitTest = { dir: "test/controllers" };
  startup.useRouter();

  await startup.invoke();

  expect(startup.result.statusCode).toBe(StatusCode.badRequest);
  expect((startup.result.body as ErrorMessage).message).toBe("br");
});
