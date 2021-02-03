import { Router } from "@hal-wang/cloudbase-access";

export default {
  get isTest(): boolean {
    if (Router.current && Router.current.requestParams.context) {
      return Router.current.requestParams.context.function_name == "test";
    } else {
      return false;
    }
  },

  adminId: "support@hal.wang",
  testId: "test@hal.wang",
};
