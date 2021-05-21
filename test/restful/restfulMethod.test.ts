import { HttpMethod, Startup } from "../../src/index";

const methods = [
  HttpMethod.get,
  HttpMethod.connect,
  HttpMethod.delete,
  HttpMethod.post,
  HttpMethod.head,
  HttpMethod.options,
  HttpMethod.patch,
  HttpMethod.put,
  HttpMethod.trace,
];

methods.forEach((method) => {
  test(`${method} restful test`, async function () {
    const event = {
      body: {},
      path: "/restful",
      httpMethod: method,
    };
    const startup = new Startup(event, {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (startup as any).unitTest = { dir: "test/controllers" };
    startup.useRouter();

    const result = await startup.invoke();
    expect(result.statusCode).toBe(200);
    expect((result.body as Record<string, unknown>).method).toBe(method);
  });
});
