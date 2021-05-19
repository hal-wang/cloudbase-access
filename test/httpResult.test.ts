import ErrorMessage from "../src/Response/ErrorMessage";
import Response from "../src/Response";
import Action from "../src/Middleware/Action";
import StatusCode from "../src/Response/StatusCode";
import HttpContext from "../src/HttpContext";
import { Request } from "../src";

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
  // {
  //   method: "methodNotAllowed",
  //   code: 405,
  // },
  {
    method: "errRequest",
    code: 500,
  },
];

for (let i = 0; i < normalMethod.length; i++) {
  const methodItem = normalMethod[i];
  class TestAction extends Action {
    async do(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[methodItem.method]();
    }
    constructor() {
      super();
      this.init(
        new HttpContext(new Request({}, {}), new Response(StatusCode.ok)),
        0
      );
    }
  }
  const action = new TestAction();
  action.do();
  test(`http result ${methodItem.method}`, async function () {
    const result = action.httpContext.response;
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

  class TestAction extends Action {
    async do(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[methodItem.method]({
        message: errorMsgTest,
      });
    }
    constructor() {
      super();
      this.init(
        new HttpContext(new Request({}, {}), new Response(StatusCode.ok)),
        0
      );
    }
  }

  const action = new TestAction();
  action.do();
  test(errorMsgTest, async function () {
    const result = action.httpContext.response;
    expect(result.statusCode).toBe(methodItem.code);
    expect((result.body as ErrorMessage).message).toBe(errorMsgTest);
  });
}

const redirectCodes = [301, 302, 303, 307, 308];
const location = "/test";
for (let i = 0; i < redirectCodes.length; i++) {
  const code = redirectCodes[i] as 301 | 302 | 303 | 307 | 308;
  test(`${code} redirect`, async function () {
    const action = new RedirectTestAction(code, location);
    await action.do();
    expect(action.httpContext.response.statusCode).toBe(code);
    expect(action.httpContext.response.headers.location).toBe(location);
  });
}

test("Response: is base64", async function () {
  const hr1 = new Response(200, undefined, undefined, true).result;
  expect(hr1.statusCode).toBe(200);
  expect(hr1.isBase64Encoded).toBe(true);

  const hr2 = new Response(200, undefined, undefined, false).result;
  expect(hr2.statusCode).toBe(200);
  expect(hr2.isBase64Encoded).toBe(false);
});

class RedirectTestAction extends Action {
  constructor(readonly code: StatusCode, readonly location: string) {
    super();

    this.init(
      new HttpContext(new Request({}, {}), new Response(StatusCode.ok)),
      0
    );
  }

  async do(): Promise<void> {
    this.redirect(this.location, this.code);
  }
}
