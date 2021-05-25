const { Startup } = require("@hal-wang/cloudbase-access");
import "@hal-wang/cloudbase-access/dist/Router";

exports.main = async (event, context) => {
  const startup = new Startup(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.demo = "js";
      await next();
    })
    .useRouter();
  return await startup.invoke();
};
