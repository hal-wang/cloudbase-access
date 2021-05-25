import { Startup } from "../../src/index";
import "../UseTest";
import "../../src/Router";

test(`method not allowed`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "NO",
  };
  const startup = new Startup(event, {}).useTest().useRouter();
  const result = await startup.invoke();
  expect(result.statusCode).toBe(405);
});
