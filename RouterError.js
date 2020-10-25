class RouterError extends Error {
  constructor(msg, router) {
    this.message = msg;
    this.router = router;
  }
}
