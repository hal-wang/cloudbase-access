import { Startup } from "../src/index";

test("request method lower case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  );
  startup.ctx.setBag("unitTest", { dir: "test/controllers" });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("request method upper case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "POST",
    },
    {}
  );
  startup.ctx.setBag("unitTest", { dir: "test/controllers" });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});
