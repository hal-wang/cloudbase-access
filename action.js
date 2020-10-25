module.exports = class Action {
  constructor(action, auth) {
    if (!action) throw new Error("action is needed");

    this.action = action;
    this.auth = auth;
  }
};
