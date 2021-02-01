import RequestParams from "./RequestParams";
import { existsSync } from "fs";
import path = require("path");
import MapCreater from "./MapCreater";
import Action from "../Action";
import linq = require("linq");
import HttpResultError from "../HttpResult/HttpResultError";
import { HttpResult } from "..";

export default class MapParser {
  constructor(
    private readonly requestParams: RequestParams,
    private readonly cFolder: string
  ) {}

  public get action(): Action {
    const map = this.getMap();
    const existedMap = this.getRestfulMapPath(map);
    return this.getActionFromMapPath(existedMap);
  }

  private getRestfulMapPath(map: string[]): string {
    const mapPath = linq
      .from(map)
      .where((item) => this.isPathMatched(item))
      .firstOrDefault();
    if (!mapPath) throw this.notFoundErr;
    return mapPath;
  }

  private isPathMatched(path: string): boolean {
    const reqUrlStrs = this.requestParams.path.toLowerCase().split("/");
    const pathStrs = path.toLowerCase().split("/");
    if (!pathStrs.length) return false;

    // method action
    if (pathStrs.length - 1 == reqUrlStrs.length) {
      if (!this.requestParams.method) throw this.notFoundErr;
      reqUrlStrs.push(this.requestParams.method.toLowerCase());
    }
    if (pathStrs.length != reqUrlStrs.length) return false;

    for (let i = 0; i < pathStrs.length - 1; i++) {
      if (pathStrs[i] != reqUrlStrs[i] && !pathStrs[i].startsWith("^")) {
        return false;
      }
    }

    let actionName = pathStrs[pathStrs.length - 1];
    const dotIndex = actionName.lastIndexOf(".");
    if (dotIndex) {
      actionName = actionName.substr(0, dotIndex);
    }
    if (actionName != reqUrlStrs[reqUrlStrs.length - 1]) {
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

  private get notFoundErr(): HttpResultError {
    return new HttpResultError(
      HttpResult.notFoundMsg({
        message: `Can't find the path：${this.requestParams.path}`,
      })
    );
  }
}
