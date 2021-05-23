const { Startup } = require("@hal-wang/cloudbase-access");
exports.main = async (event, context) => {
  const startup = new Startup(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.demo = "js";
      await next();
    })
    .useRouter();
  return await startup.invoke();
};
