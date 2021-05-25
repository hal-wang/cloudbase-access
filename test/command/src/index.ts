import { Startup } from "@hal-wang/cloudbase-access";
import "@hal-wang/cloudbase-access/dist/Router";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  const startup = new Startup(event, context).useRouter();
  await startup.invoke();
  return startup.result;
};
