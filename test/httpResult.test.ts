import ErrorMessage from "../src/ErrorMessage";
import HttpResult from "../src/HttpResult";

test("302 redirect test", async function () {
  const httpResult = HttpResult.redirect("/test").result;
  expect(httpResult.statusCode).toBe(302);
  expect(httpResult.headers.location).toBe("/test");
});

const errorMsgTest = "error message test";
test(errorMsgTest, async function () {
  const httpResult = HttpResult.badRequestMsg({ message: errorMsgTest }).result;
  expect(httpResult.statusCode).toBe(400);
  expect((httpResult.body as ErrorMessage).message).toBe(errorMsgTest);
});
