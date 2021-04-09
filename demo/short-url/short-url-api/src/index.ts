import { HttpResult, Router } from "@hal-wang/cloudbase-access";
import { AppInstanceMiddleware } from "./middlewares/AppInstanceMiddleware";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", event, context);
  setHeaders();

  const router = new Router(event, context);
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
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = <Record<string, unknown>>require("./package.json");
  HttpResult.baseHeaders.version = config.version as string;

  HttpResult.baseHeaders.demo = "short-url";
}
