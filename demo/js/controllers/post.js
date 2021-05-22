const { Action } = require("@hal-wang/cloudbase-access");

exports.default = class extends Action {
  async invoke() {
    this.ok("POST");
  }
};
