import { Startup } from "../../src/index";

test(`method not allowed`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "NO",
  };
  const startup = new Startup(event, {});
  startup.useRouter("test/controllers");
  await startup.do();
  const result = startup.response;
  expect(result.statusCode).toBe(405);
});
