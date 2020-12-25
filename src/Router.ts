import Authority from "./Authority";
import Action from "./Action";
import HttpResult from "./HttpResult";
import Middleware, { MiddlewareType } from "./Middleware";
import RequestParams from "./RequestParams";
import MapCreater from "./MapCreater";
import MapItem from "./MapItem";

export default class Router {
  private readonly middlewares: Array<Middleware> = new Array<Middleware>();

  readonly requestParams: RequestParams;

  constructor(
    event: Record<string, unknown>,
    context: Record<string, unknown>,
    private readonly auth?: Authority,
    public readonly cFolder = "controllers"
  ) {
    this.requestParams = new RequestParams(event, context);

    if (auth != null) this.middlewares.push(auth);
  }

  configure(mdw: Middleware): void {
    this.middlewares.push(mdw);
  }

  async do(): Promise<HttpResult> {
    const mapItem = this.getMapItem();
    if (!mapItem) {
      return HttpResult.notFound(
        "Can't find the path：" + this.requestParams.path
      );
    }

    let mdwResult = await this.ExecMdw(MiddlewareType.BeforeStart);
    if (mdwResult) return mdwResult;

    const actionPath = `${process.cwd()}/${this.cFolder}/${mapItem.path}`;
    const action = await this.getAction(actionPath);

    mdwResult = await this.ExecMdw(MiddlewareType.BeforeAction);
    if (mdwResult) return mdwResult;

    const result = await action.do();
    if (result.isSuccess) {
      mdwResult = await this.ExecMdw(MiddlewareType.BeforeSuccessEnd);
    } else {
      mdwResult = await this.ExecMdw(MiddlewareType.BeforeErrEnd);
    }
    if (mdwResult) return mdwResult;

    mdwResult = await this.ExecMdw(MiddlewareType.BeforeEnd);
    if (mdwResult) return mdwResult;

    return result;
  }

  private async ExecMdw(type: MiddlewareType) {
    for (let i = 0; i < this.middlewares.length; i++) {
      const middleware = this.middlewares[i];
      if (middleware.type != type) continue;

      middleware.requestParams = this.requestParams;
      const mdwResult = await middleware.do();
      if (mdwResult) return mdwResult;
    }
    return null;
  }

  private getMapItem(): MapItem | undefined {
    const mapItem = new MapCreater(this.requestParams, this.cFolder).getMap();
    if (!mapItem) return;

    if (this.auth != null) this.auth.roles = mapItem.roles;
    return mapItem;
  }

  private async getAction(actionPath: string): Promise<Action> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(actionPath).default;
    const routerAction = new actionClass(this.requestParams) as Action;
    routerAction.requestParams = this.requestParams;
    routerAction.middlewares = this.middlewares.map((val) => val);
    return routerAction;
  }
}
