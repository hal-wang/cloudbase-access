const enum MiddlewareType {
  BeforeStart = 1, // the action object is not inited
  BeforeAction, // exec before action doing, the action object is inited
  BeforeEnd, // exec after action doing
  BeforeSuccessEnd, // exec after action doing, if the result is succeeded
  BeforeErrEnd, // exec after action doing, if the result is error
}

export default MiddlewareType;
