import Request from "../Request";
import { existsSync } from "fs";
import path = require("path");
import MapCreater from "./MapCreater";
import Action from "../Middleware/Action";
import linq = require("linq");
import ResponseError from "../Response/ResponseError";
import PathParser from "./PathParser";
import HttpMethod from "../Request/HttpMethod";
import StatusCode from "../Response/StatusCode";
import Response from "../Response";
import Constant from "../Constant";

export default class MapParser {
  public readonly realPath: string;

  constructor(
    private readonly req: Request,
    private readonly dir: string,
    public readonly strict: boolean
  ) {
    const map = this.getMap();
    this.realPath = this.getRestfulMapPath(map);

    this.setQuery();
  }

  public get action(): Action {
    const filePath = path.join(this.dirPath, this.realPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(filePath).default;
    const action = new actionClass() as Action;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (action as any).realPath = this.realPath;
    return action;
  }

  private setQuery(): void {
    if (!this.realPath.includes("^")) return;

    const reqPath = this.req.path;
    const mapPathStrs = this.realPath.split("/");
    const reqPathStrs = reqPath.split("/");
    for (let i = 0; i < Math.min(mapPathStrs.length, reqPathStrs.length); i++) {
      const mapPathStr = mapPathStrs[i];
      if (!mapPathStr.startsWith("^")) continue;
      const reqPathStr = reqPathStrs[i];

      const key = mapPathStr.substr(1, mapPathStr.length - 1);
      const value = decodeURIComponent(reqPathStr);
      this.req.query[key] = value;
    }
  }

  private getRestfulMapPath(map: string[]): string {
    let mapPath;

    if (!this.strict) {
      const matchedPaths = linq
        .from(map)
        .where((item) => this.isSimplePathMatched(item))
        .toArray();
      mapPath = this.getMostLikePath(matchedPaths);
      if (mapPath) return mapPath;
    }

    const matchedPaths = linq
      .from(map)
      .where((item) => !!new PathParser(item).httpMethod)
      .where((item) => this.isMethodPathMatched(item, true))
      .toArray();
    mapPath = this.getMostLikePath(matchedPaths);
    if (mapPath) return mapPath;

    const anyMethodPaths = linq
      .from(map)
      .where((item) => new PathParser(item).httpMethod == HttpMethod.any)
      .where((item) => this.isMethodPathMatched(item, false))
      .toArray();
    mapPath = this.getMostLikePath(anyMethodPaths);
    if (mapPath) return mapPath;

    const otherMethodPathCount = linq
      .from(map)
      .where((item) => !!new PathParser(item).httpMethod)
      .where((item) => this.isMethodPathMatched(item, false))
      .count();
    if (otherMethodPathCount) throw this.methodNotAllowedErr;

    throw this.notFoundErr;
  }

  private isSimplePathMatched(mapPath: string): boolean {
    mapPath = this.removeExtension(mapPath);
    const reqUrlStrs = this.req.path.toLowerCase().split("/");
    const mapPathStrs = mapPath.toLowerCase().split("/");
    if (reqUrlStrs.length != mapPathStrs.length) return false;

    return this.isPathMatched(mapPathStrs, reqUrlStrs);
  }

  private isMethodPathMatched(
    mapPath: string,
    methodIncluded: boolean
  ): boolean {
    mapPath = this.removeExtension(mapPath);
    const reqUrlStrs = this.req.path
      ? this.req.path.toLowerCase().split("/")
      : [];
    const mapPathStrs = mapPath.toLowerCase().split("/");
    if (reqUrlStrs.length != mapPathStrs.length - 1) return false;
    if (!this.req.method) return false;

    if (methodIncluded) {
      reqUrlStrs.push(String(this.req.method).toLowerCase());
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

  private getMostLikePath(mapPaths: string[]): string | undefined {
    if (!mapPaths || !mapPaths.length) return;
    if (mapPaths.length == 1) return mapPaths[0];

    const pathsParts = <{ path: string; parts: string[] }[]>[];
    mapPaths.forEach((path) => {
      pathsParts.push({
        path: path,
        parts: path.toLowerCase().split("/"),
      });
    });

    const minPartsCount = Math.min(
      ...linq
        .from(pathsParts)
        .select((pp) => pp.parts.length)
        .toArray()
    );
    for (let i = 0; i < minPartsCount; i++) {
      const notLikePaths = linq
        .from(pathsParts)
        .select((pp) => ({ part: pp.parts[i], path: pp.path }))
        .where((p) => p.part.includes("^"))
        .toArray();
      if (notLikePaths.length > 0 && notLikePaths.length < pathsParts.length) {
        notLikePaths.forEach((mlp) => {
          const ppToRemove = linq
            .from(pathsParts)
            .where((p) => p.path == mlp.path)
            .firstOrDefault();
          if (ppToRemove) {
            pathsParts.splice(pathsParts.indexOf(ppToRemove), 1);
          }
        });
      }

      if (pathsParts.length == 1) return pathsParts[0].path;
    }

    const mostLikePathParts = linq
      .from(pathsParts)
      .orderBy((pp) => pp.parts.length)
      .firstOrDefault();
    if (!mostLikePathParts) return;
    return mostLikePathParts.path;
  }

  private get dirPath(): string {
    return path.join(process.cwd(), this.dir);
  }

  private getMap(): string[] {
    const mapPath = path.join(process.cwd(), Constant.mapFileName);
    if (existsSync(mapPath)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(mapPath);
    } else {
      return new MapCreater(this.dir).map;
    }
  }

  private removeExtension(name: string): string {
    const dotIndex = name.lastIndexOf(".");
    if (dotIndex > 0) {
      name = name.substr(0, dotIndex);
    }
    return name;
  }

  private get notFoundErr(): ResponseError {
    const msg = `Can't find the path：${this.req.path}`;
    return new ResponseError(
      new Response(StatusCode.notFound, {
        message: msg,
        path: this.req.path,
      }),
      msg
    );
  }

  private get methodNotAllowedErr(): ResponseError {
    const msg = `method not allowed：${this.req.method}`;
    return new ResponseError(
      new Response(StatusCode.methodNotAllowedMsg, {
        message: msg,
        method: this.req.method,
        path: this.req.path,
      }),
      msg
    );
  }
}
