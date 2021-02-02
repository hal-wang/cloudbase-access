import RequestParams from "./RequestParams";
import { existsSync } from "fs";
import path = require("path");
import MapCreater from "./MapCreater";
import Action from "../Action";
import linq = require("linq");
import HttpResultError from "../HttpResult/HttpResultError";
import { HttpResult } from "..";
import RequestMethod from "./RequestMethod";

export default class MapParser {
  constructor(
    private readonly requestParams: RequestParams,
    private readonly cFolder: string,
    public readonly isMethodNecessary: boolean
  ) {}

  public get action(): Action {
    const map = this.getMap();
    const existedMap = this.getRestfulMapPath(map);
    const action = this.getActionFromMapPath(existedMap);
    this.setQuery(existedMap);
    return action;
  }

  private setQuery(mapPath: string): void {
    if (!mapPath.includes("^")) return;

    const reqPath = this.requestParams.path;
    const mapPathStrs = mapPath.split("/");
    const reqPathStrs = reqPath.split("/");
    for (let i = 0; i < Math.min(mapPathStrs.length, reqPathStrs.length); i++) {
      const mapPathStr = mapPathStrs[i];
      if (!mapPathStr.startsWith("^")) continue;
      const reqPathStr = reqPathStrs[i];

      const key = mapPathStr.substr(1, mapPathStr.length - 1);
      const value = reqPathStr;
      this.requestParams.query[key] = value;
    }
  }

  private getRestfulMapPath(map: string[]): string {
    const mapPath = linq
      .from(map)
      .where((item) => this.isPathMatched(item, true))
      .firstOrDefault();
    if (mapPath) return mapPath;

    const likePathsCount = linq
      .from(map)
      .where((item) => this.isPathMatched(item, false))
      .where((item) => {
        const name = this.removeExtension(item);
        return (
          name.endsWith(RequestMethod.delete.toLowerCase()) ||
          name.endsWith(RequestMethod.get.toLowerCase()) ||
          name.endsWith(RequestMethod.post.toLowerCase()) ||
          name.endsWith(RequestMethod.patch.toLowerCase()) ||
          name.endsWith(RequestMethod.put.toLowerCase())
        );
      })
      .count();

    if (likePathsCount) throw this.methodNotAllowedErr;
    else throw this.notFoundErr;
  }

  private isPathMatched(path: string, methodIncluded: boolean): boolean {
    const reqUrlStrs = this.requestParams.path.toLowerCase().split("/");
    const pathStrs = path.toLowerCase().split("/");
    if (!pathStrs.length) return false;

    // method action
    if (pathStrs.length - 1 == reqUrlStrs.length) {
      if (!this.requestParams.method) throw this.notFoundErr;
      if (methodIncluded) {
        reqUrlStrs.push(this.requestParams.method.toLowerCase());
      } else {
        pathStrs.splice(pathStrs.length - 1, 1);
      }
    } else if (this.isMethodNecessary) {
      throw this.notFoundErr;
    }

    if (pathStrs.length != reqUrlStrs.length) return false;

    for (let i = 0; i < pathStrs.length - 1; i++) {
      if (pathStrs[i] != reqUrlStrs[i] && !pathStrs[i].startsWith("^")) {
        return false;
      }
    }

    const actionName = pathStrs[pathStrs.length - 1];
    if (this.removeExtension(actionName) != reqUrlStrs[reqUrlStrs.length - 1]) {
      return false;
    }

    return true;
  }

  private getActionFromMapPath(mapPath: string) {
    const filePath = path.join(this.cfPath, mapPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(filePath).default;
    return new actionClass() as Action;
  }

  private get cfPath(): string {
    return path.join(process.cwd(), this.cFolder);
  }

  private getMap(): string[] {
    const mapPath = path.join(process.cwd(), "cba-map.json");
    if (existsSync(mapPath)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(mapPath);
    } else {
      return new MapCreater(this.cfPath).map;
    }
  }

  private removeExtension(name: string): string {
    const dotIndex = name.lastIndexOf(".");
    if (dotIndex > 0) {
      name = name.substr(0, dotIndex);
    }
    return name;
  }

  private get notFoundErr(): HttpResultError {
    return new HttpResultError(
      HttpResult.notFoundMsg({
        message: `Can't find the path：${this.requestParams.path}`,
        path: this.requestParams.path,
      })
    );
  }

  private get methodNotAllowedErr(): HttpResultError {
    return new HttpResultError(
      HttpResult.methodNotAllowedMsg({
        message: `method not allowed：${this.requestParams.method}`,
        method: this.requestParams.method,
        path: this.requestParams.path,
      })
    );
  }
}
