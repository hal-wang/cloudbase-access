import { existsSync, lstatSync } from "fs";
import * as path from "path";
import ApiDocsConfig from "./ApiDocs/ApiDocsConfig";

export interface AppConfig {
  router?: RouterConfig;
  ts?: TsConfig;
  doc?: ApiDocsConfig;
}

export interface RouterConfig {
  dir?: string;
  strict?: boolean;
}

export interface TsStaticItemConfig {
  source: string;
  target: string;
}

export interface TsConfig {
  static?: TsStaticItemConfig[];
}

export default class Config {
  private static _default?: AppConfig = undefined;
  public static get default(): AppConfig {
    if (this._default) return this._default;

    const configPath = path.join(process.cwd(), "cba.config.json");
    if (!existsSync(configPath)) {
      throw new Error("the config file is not exist");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this._default = require(configPath) as AppConfig;
      return this._default;
    }
  }

  public static defaultRouterDir = "controllers";
  public static defaultStrict = false;

  public static getRouterDirPath(config: AppConfig): string {
    if (!config) {
      throw new Error("the config file is not exist");
    }
    if (!config.router) {
      throw new Error("there is no router config");
    }

    let outDir = "";
    const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
    if (existsSync(tsconfigPath)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const tsconfig = require(tsconfigPath);
      const existDir =
        tsconfig.compilerOptions && tsconfig.compilerOptions.outDir;
      if (existDir) {
        outDir = tsconfig.compilerOptions.outDir;
      }
    }

    const result = path.join(
      outDir,
      config.router && config.router.dir
        ? config.router.dir
        : this.defaultRouterDir
    );

    if (!existsSync(result) || !lstatSync(result).isDirectory()) {
      throw new Error("the router dir is not exist");
    }

    return result;
  }
}
