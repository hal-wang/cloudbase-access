import { Startup } from "../src/index";

test("request method lower case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (startup as any).unitTest = { dir: "test/controllers" };
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (startup as any).unitTest = { dir: "test/controllers" };
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});
