import { HttpResult, Router } from "@hal-wang/cloudbase-access";
import { AppInstanceMiddleware } from "./middlewares/AppInstanceMiddleware";
import Auth from "./lib/Auth";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", event, context);
  setHeaders();

  const router = new Router(event, context, new Auth());
  router.isMethodNecessary = true;
  router.configure(new AppInstanceMiddleware());
  try {
    return (await router.do()).result;
  } catch (err) {
    if (err.httpResult) {
      return err.httpResult.result;
    } else {
      return HttpResult.errRequestMsg({ message: err.message }).result;
    }
  }
};

function setHeaders(): void {
  const config = <Record<string, unknown>>require("./package.json");
  HttpResult.baseHeaders.version = config.version as string;

  HttpResult.baseHeaders.demo = "cba-todo";
}
