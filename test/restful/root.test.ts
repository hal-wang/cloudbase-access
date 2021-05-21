import { HttpMethod, Startup } from "../../src";

test("restful root get", async function () {
  const event = {
    body: {},
    path: "/",
    httpMethod: "GET",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: "test/controllers" });
  startup.useRouter();

  const result = await startup.invoke();
  expect(result.statusCode).toBe(200);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((result.body as any).method).toBe(HttpMethod.get);
});
