import { HttpMethod, Startup } from "../../src/index";
import "../UseTest";
import "../../src/Router";

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
    const startup = new Startup(event, {}).useTest().useRouter();

    const result = await startup.invoke();
    expect(result.statusCode).toBe(200);
    expect((result.body as Record<string, unknown>).method).toBe(method);
  });
});
