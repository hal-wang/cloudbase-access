import { HttpMethod, Startup } from "../../src/index";

test(`restful query test1`, async function () {
  const event = {
    body: {},
    path: "/restful/45",
    httpMethod: HttpMethod.get,
  };
  const startup = new Startup(event, {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (startup as any).unitTest = { dir: "test/controllers" };
  startup.useRouter();

  const result = await startup.invoke();
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("45");
});

test(`restful query test2`, async function () {
  const event = {
    body: {},
    path: "/restful/11/animals",
    httpMethod: HttpMethod.get,
  };
  const startup = new Startup(event, {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (startup as any).unitTest = { dir: "test/controllers" };
  startup.useRouter();

  const result = await startup.invoke();
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("11");
});
