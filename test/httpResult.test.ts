import ErrorMessage from "../src/HttpResult/ErrorMessage";
import HttpResult from "../src/HttpResult";

const normalMethod = [
  {
    method: "ok",
    code: 200,
  },
  {
    method: "accepted",
    code: 202,
  },
  {
    method: "noContent",
    code: 204,
  },
  {
    method: "partialContent",
    code: 206,
  },
  {
    method: "badRequest",
    code: 400,
  },
  {
    method: "unauthorized",
    code: 401,
  },
  {
    method: "forbidden",
    code: 403,
  },
  {
    method: "notFound",
    code: 404,
  },
  {
    method: "methodNotAllowed",
    code: 405,
  },
  {
    method: "errRequest",
    code: 500,
  },
];

for (let i = 0; i < normalMethod.length; i++) {
  const methodItem = normalMethod[i];
  test(`http result ${methodItem.method}`, async function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hr = (HttpResult as any)[methodItem.method]();
    const result = hr.result;
    expect(result.statusCode).toBe(methodItem.code);
  });
}

const msgMethods = [
  {
    method: "badRequestMsg",
    code: 400,
  },
  {
    method: "unauthorizedMsg",
    code: 401,
  },
  {
    method: "forbiddenMsg",
    code: 403,
  },
  {
    method: "notFoundMsg",
    code: 404,
  },
  {
    method: "errRequestMsg",
    code: 500,
  },
];
for (let i = 0; i < msgMethods.length; i++) {
  const methodItem = msgMethods[i];
  const errorMsgTest = `error message ${methodItem.method}`;
  test(errorMsgTest, async function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hr = (HttpResult as any)[methodItem.method]({
      message: errorMsgTest,
    });
    const result = hr.result;
    expect(result.statusCode).toBe(methodItem.code);
    expect((result.body as ErrorMessage).message).toBe(errorMsgTest);
  });
}

const redirectCodes = [301, 302, 303, 307, 308];
for (let i = 0; i < redirectCodes.length; i++) {
  const code = redirectCodes[i] as 301 | 302 | 303 | 307 | 308;
  test(`${code} redirect`, async function () {
    const hr = HttpResult.redirect("/test", code);
    const result = hr.result;
    expect(result.statusCode).toBe(code);
    expect(result.headers.location).toBe("/test");
  });
}

test("HttpResult: is base64", async function () {
  const hr1 = HttpResult.base(200, undefined, undefined, true).result;
  expect(hr1.statusCode).toBe(200);
  expect(hr1.isBase64Encoded).toBe(true);

  const hr2 = HttpResult.base(200, undefined, undefined, false).result;
  expect(hr2.statusCode).toBe(200);
  expect(hr2.isBase64Encoded).toBe(false);
});
