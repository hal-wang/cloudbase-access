import { Startup } from "../../src";

test("simpple middleware", async function () {
  const startup = new Startup({}, {});

  startup.use(async (ctx, next) => {
    ctx.response.headers.mdw1 = "mdw1";
    await next();
  });
  startup.use(async (ctx, next) => {
    ctx.response.headers.mdw2 = "mdw2";
    await next();
    ctx.response.headers.mdw4 = "mdw4->2";
  });
  startup.use(async (ctx, next) => {
    ctx.response.headers.mdw3 = "mdw3";
    await next();
  });
  startup.use(async (ctx, next) => {
    ctx.response.headers.mdw4 = "mdw4";
    await next();
  });
  startup.use(async (ctx, next) => {
    ctx.response.headers.mdw5 = "mdw5";
    await next();
  });

  await startup.invoke();
  const result = startup.ctx.response;
  expect(result.statusCode).toBe(200);
  expect(result.headers.mdw1).toBe("mdw1");
  expect(result.headers.mdw2).toBe("mdw2");
  expect(result.headers.mdw3).toBe("mdw3");
  expect(result.headers.mdw4).toBe("mdw4->2");
  expect(result.headers.mdw5).toBe("mdw5");
  expect(result.headers.mdw6).toBeUndefined();
});
