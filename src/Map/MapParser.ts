import RequestParams from "../Router/RequestParams";
import { existsSync } from "fs";
import path = require("path");
import MapCreater from "./MapCreater";
import Action from "../Action";
import linq = require("linq");
import HttpResultError from "../HttpResult/HttpResultError";
import { HttpResult } from "..";
import PathParser from "./PathParser";

export default class MapParser {
  public readonly realPath: string;

  constructor(
    private readonly requestParams: RequestParams,
    private readonly cFolder: string,
    public readonly isMethodNecessary: boolean
  ) {
    const map = this.getMap();
    this.realPath = this.getRestfulMapPath(map);

    this.setQuery();
  }

  public get action(): Action {
    const filePath = path.join(this.cfPath, this.realPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(filePath).default;
    const action = new actionClass() as Action;
    action.realPath = this.realPath;
    action.requestParams = this.requestParams;
    return action;
  }

  private setQuery(): void {
    if (!this.realPath.includes("^")) return;

    const reqPath = this.requestParams.path;
    const mapPathStrs = this.realPath.split("/");
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
    let mapPath;

    if (!this.isMethodNecessary) {
      mapPath = linq
        .from(map)
        .where((item) => this.isSimplePathMatched(item))
        .firstOrDefault();
      if (mapPath) return mapPath;
    }

    mapPath = linq
      .from(map)
      .where((item) => this.isMethodPathMatched(item, true))
      .firstOrDefault();
    if (mapPath) return mapPath;

    const otherMethodPathCount = linq
      .from(map)
      .where((item) => this.isMethodPathMatched(item, false))
      .where((item) => !!new PathParser(item).httpMethod)
      .count();
    if (otherMethodPathCount) throw this.methodNotAllowedErr;

    throw this.notFoundErr;
  }

  private isSimplePathMatched(mapPath: string): boolean {
    mapPath = this.removeExtension(mapPath);
    const reqUrlStrs = this.requestParams.path.toLowerCase().split("/");
    const mapPathStrs = mapPath.toLowerCase().split("/");
    if (!mapPathStrs.length || !reqUrlStrs.length) return false;
    if (reqUrlStrs.length != mapPathStrs.length) return false;

    return this.isPathMatched(mapPathStrs, reqUrlStrs);
  }

  private isMethodPathMatched(
    mapPath: string,
    methodIncluded: boolean
  ): boolean {
    mapPath = this.removeExtension(mapPath);
    const reqUrlStrs = this.requestParams.path.toLowerCase().split("/");
    const mapPathStrs = mapPath.toLowerCase().split("/");
    if (!mapPathStrs.length || !reqUrlStrs.length) return false;
    if (reqUrlStrs.length != mapPathStrs.length - 1) return false;
    if (!this.requestParams.method) return false;

    if (methodIncluded) {
      reqUrlStrs.push(this.requestParams.method.toLowerCase());
    } else {
      mapPathStrs.splice(mapPathStrs.length - 1, 1);
    }

    return this.isPathMatched(mapPathStrs, reqUrlStrs);
  }

  private isPathMatched(mapPathStrs: string[], reqUrlStrs: string[]): boolean {
    if (mapPathStrs.length != reqUrlStrs.length) return false;

    for (let i = 0; i < mapPathStrs.length; i++) {
      if (mapPathStrs[i] != reqUrlStrs[i] && !mapPathStrs[i].startsWith("^")) {
        return false;
      }
    }

    return true;
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
      return new MapCreater(this.cFolder).map;
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
