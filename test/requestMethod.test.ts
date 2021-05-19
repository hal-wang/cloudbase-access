import { Startup } from "../src/index";

test("request method test", async function () {
  let startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  );
  startup.useRouter("test/controllers");

  await startup.do();
  let result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);

  startup = new Startup(
    {
      path: "/router",
      httpMethod: "POST",
    },
    {}
  );
  startup.useRouter("test/controllers");

  await startup.do();
  result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
});
