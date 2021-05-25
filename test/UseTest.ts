import * as cba from "../src";
import { RouterConfig } from "../src";

declare module "../src" {
  interface Startup {
    useTest(config?: RouterConfig): cba.Startup;
  }
}

cba.Startup.prototype.useTest = function (config?: RouterConfig) {
  if (!config) {
    config = {};
  }
  if (!config.dir) {
    config.dir = "./test/controllers";
  }

  this.ctx.setBag("unitTest", config);
  return this;
};
