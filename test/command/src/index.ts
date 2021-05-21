import { Startup } from "@hal-wang/cloudbase-access";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  const startup = new Startup(event, context);
  startup.useRouter();
  await startup.invoke();
  return startup.httpContext.response.result;
};
