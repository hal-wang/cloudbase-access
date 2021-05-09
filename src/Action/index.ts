import ApiDocs from "../ApiDocs";
import HttpResult from "../HttpResult";
import RequestParams from "../Router/RequestParams";

export default abstract class Action {
  constructor(public readonly roles: Array<string> = new Array<string>()) {}

  //#region will be set before doing
  readonly requestParams!: RequestParams;
  readonly realPath!: string;
  //#endregion

  /** docs of action */
  docs?: ApiDocs;

  protected readonly httpResult = HttpResult.base;
  protected readonly ok = HttpResult.ok;
  protected readonly accepted = HttpResult.accepted;
  protected readonly noContent = HttpResult.noContent;
  protected readonly partialContent = HttpResult.partialContent;
  protected readonly badRequest = HttpResult.badRequest;
  protected readonly badRequestMsg = HttpResult.badRequestMsg;
  protected readonly unauthorized = HttpResult.unauthorized;
  protected readonly unauthorizedMsg = HttpResult.unauthorizedMsg;
  protected readonly forbidden = HttpResult.forbidden;
  protected readonly forbiddenMsg = HttpResult.forbiddenMsg;
  protected readonly notFound = HttpResult.notFound;
  protected readonly notFoundMsg = HttpResult.notFoundMsg;
  protected readonly errRequest = HttpResult.errRequest;
  protected readonly errRequestMsg = HttpResult.errRequestMsg;
  protected readonly redirect = HttpResult.redirect;
  protected readonly created = HttpResult.created;

  abstract do(): Promise<HttpResult>;
}
