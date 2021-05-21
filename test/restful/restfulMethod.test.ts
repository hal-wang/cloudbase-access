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
    startup.useRouter({ forceControllerFolder: "test/controllers" });

    await startup.invoke();
    const result = startup.httpContext.response;
    expect(result.statusCode).toBe(200);
    expect((result.body as Record<string, unknown>).method).toBe(method);
  });
});
