import { HttpMethod, Startup } from "../../src/index";
import "../UseTest";
import "../../src/Router";

const methods = ["test", "aaa", "NO"];

methods.forEach((method) => {
  test(`${method} -> any restful test`, async function () {
    const event = {
      body: {},
      path: "/restful",
      httpMethod: method,
    };
    const startup = new Startup(event, {}).useTest().useRouter();

    const result = await startup.invoke();
    expect(result.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(!!(result.body as any).method).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result.body as any).method).toBe(HttpMethod.any);
  });
});
