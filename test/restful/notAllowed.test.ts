import { Startup } from "../../src/index";

test(`method not allowed`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "NO",
  };
  const startup = new Startup(event, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (startup as any).unitTest = { dir: "test/controllers" };
  startup.useRouter();
  const result = await startup.invoke();
  expect(result.statusCode).toBe(405);
});
