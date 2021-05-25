import { Startup } from "@hal-wang/cloudbase-access";
import "@hal-wang/cloudbase-access/dist/Router";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  const startup = new Startup(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.demo = "ts";
      await next();
    })
    .useRouter();
  return await startup.invoke();
};
