import ApiDocs from "../ApiDocs";
import HttpResult from "../HttpResult";
import { RequestParams } from "../Router";

export default abstract class Action {
  constructor(public readonly roles: Array<string> = new Array<string>()) {}

  protected readonly base = HttpResult.base;
  protected readonly ok = HttpResult.ok;
  protected readonly accepted = HttpResult.accepted;
  protected readonly noContent = HttpResult.noContent;
  protected readonly partialContent = HttpResult.partialContent;
  protected readonly badRequest = HttpResult.badRequest;
  protected readonly badRequestMsg = HttpResult.badRequestMsg;
  protected readonly forbidden = HttpResult.forbidden;
  protected readonly forbiddenMsg = HttpResult.forbiddenMsg;
  protected readonly notFound = HttpResult.notFound;
  protected readonly notFoundMsg = HttpResult.notFoundMsg;
  protected readonly errRequest = HttpResult.errRequest;
  protected readonly errRequestMsg = HttpResult.errRequestMsg;
  protected readonly redirect = HttpResult.redirect;
  protected readonly created = HttpResult.created;

  /** will be set before doing */
  requestParams = RequestParams.empty;

  /**docs of api action */
  inputDocs?: ApiDocs;
  outputDocs?: ApiDocs;

  abstract do(): Promise<HttpResult>;
}
